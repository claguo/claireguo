import React, { useState } from "react";
import { LuLoader2, LuPlane, LuSearch } from "react-icons/lu";

// labels, colors and layout mirror stardrift.ai/starlink (dark theme)
const VERDICTS = {
  yes: { label: "HAS STARLINK", className: "text-[#4ade80]" },
  probably_yes: { label: "LIKELY HAS STARLINK", className: "text-[#4ade80]" },
  probably_no: { label: "LIKELY NO STARLINK", className: "text-[#fbbf24]" },
  no: { label: "NO STARLINK", className: "text-[#f87171]" },
};

const localDate = (daysFromToday = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const formatFlight = (ident) => ident.replace(/^([A-Z0-9]{2})(\d+)$/, "$1 $2");

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

function Corner({ className }) {
  return (
    <div className={`absolute z-10 h-1 w-1 bg-[#B5B5B5] ${className}`} />
  );
}

function StarlinkChecker() {
  const [flight, setFlight] = useState("");
  const [date, setDate] = useState(() => localDate(1));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(null);

  const check = async (route) => {
    const ident = flight.replace(/\s+/g, "").toUpperCase();
    if (!ident || loading) return;

    const params = new URLSearchParams({ flight: ident, date });
    if (route) {
      params.set("from", route.from_airport);
      params.set("to", route.to_airport);
    }

    setFlight(ident);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`/api/starlink/check?${params}`);
      const data = await res.json();
      const detail = data?.detail;

      if (res.ok && VERDICTS[data?.verdict]) {
        if (data.flight_info?.found) {
          setResult(data);
          setChecked({ flight: ident, date, query: params.toString() });
        } else {
          setError({ message: "Couldn't find that flight on that date." });
        }
      } else if (detail?.error === "route_disambiguation_required") {
        setError({
          message: "This flight number has multiple routes on that date.",
          hint: "Choose your route below.",
          candidates: detail.candidates || [],
        });
      } else if (res.status === 400 || res.status === 422) {
        setError({
          message: "That doesn't look like a flight number.",
          hint: "Try something like UA123.",
        });
      } else {
        setError({ message: "Something went wrong." });
      }
    } catch (err) {
      setError({ message: "Something went wrong." });
    }
    setLoading(false);
  };

  const verdict = result && VERDICTS[result.verdict];
  const info = result?.flight_info;
  const hasRoute = info?.departure_airport_code && info?.arrival_airport_code;

  return (
    <div className="starlink-dark relative w-full max-w-[480px] rounded bg-[var(--sl-card)] p-2 text-sm shadow-md">
      <Corner className="top-1.5 left-1.5" />
      <Corner className="top-1.5 right-1.5" />
      <Corner className="bottom-1.5 left-1.5" />
      <Corner className="right-1.5 bottom-1.5" />

      <form
        className="m-2 flex items-center rounded-full border border-[var(--sl-border)] bg-[var(--sl-muted)] py-1 pl-3 pr-2"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <LuPlane className="size-4 shrink-0 text-[var(--sl-muted-foreground)]" />
        <input
          className="h-9 min-w-0 flex-1 bg-transparent px-2 text-[var(--sl-foreground)] placeholder-[var(--sl-muted-foreground)] focus:outline-none"
          type="text"
          value={flight}
          onChange={(e) => setFlight(e.target.value.toUpperCase())}
          placeholder="Flight number, e.g. UA123"
          aria-label="Flight number"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={8}
          required
        />
        <div className="h-6 w-px shrink-0 bg-[var(--sl-border)]" />
        <input
          className="h-9 shrink-0 bg-transparent px-2 text-[var(--sl-foreground)] [color-scheme:dark] focus:outline-none"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Flight date"
          required
        />
        <button
          type="submit"
          disabled={loading || !flight.trim()}
          title="Search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#BD2717] bg-[linear-gradient(180deg,#C90609_0%,#FF493C_100%)] text-white shadow-[1px_3px_6px_0_rgba(44,42,44,0.20),inset_-1px_-1px_4px_0_#a30507,inset_1px_1px_4px_0_#ff8a7c] transition-transform duration-100 hover:scale-[1.02] active:scale-[0.98] disabled:border-transparent disabled:bg-none disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none disabled:hover:scale-100"
        >
          {loading ? (
            <LuLoader2 className="size-4 animate-spin" />
          ) : (
            <LuSearch className="size-4" />
          )}
        </button>
      </form>

      <div className="flex min-h-[9rem] flex-col gap-4 p-4" aria-live="polite">
        {loading && (
          <div className="flex items-center gap-2 text-[var(--sl-muted-foreground)]">
            <LuLoader2 className="size-4 animate-spin" />
            Checking this flight…
          </div>
        )}

        {!loading && !result && !error && (
          <p className="text-[var(--sl-muted-foreground)]">
            Enter a flight number to check Starlink coverage.
          </p>
        )}

        {error && (
          <div className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-4">
            <p className="font-semibold text-[#991b1b]">{error.message}</p>
            {error.hint && <p className="mt-1 text-[#b91c1c]">{error.hint}</p>}
            {error.candidates?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {error.candidates.map((route) => (
                  <button
                    key={`${route.from_airport}-${route.to_airport}`}
                    type="button"
                    onClick={() => check(route)}
                    className="rounded border border-[#fca5a5] bg-white px-2 py-1 text-xs text-[#2c2a2c] hover:bg-[#fef2f2]"
                  >
                    {route.from_airport} → {route.to_airport}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {verdict && (
          <>
            <div>
              <span className="font-pixel text-[48px] leading-none">
                {hasRoute
                  ? `${info.departure_airport_code}–${info.arrival_airport_code}`
                  : formatFlight(checked.flight)}
              </span>
              <div className="mt-2">
                {formatFlight(checked.flight)} · {formatDate(checked.date)}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`flex w-fit items-center gap-2.5 border border-[var(--sl-border)] px-3 py-1.5 ${verdict.className}`}
              >
                <div className="h-1 w-1 animate-blink bg-current" />
                {verdict.label}
              </span>
              <a
                href={`https://stardrift.ai/starlink?${checked.query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase text-[var(--sl-muted-foreground)] underline underline-offset-2 hover:text-[var(--sl-foreground)]"
              >
                Details
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StarlinkChecker;
