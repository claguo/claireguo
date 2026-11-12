import React, { useState } from "react";

const IMAGE_BASE = "https://images.claireguo.com/stardrift";

// One Home screen per moment in the trip.
const STOPS = [
  {
    label: "1 week before",
    src: `${IMAGE_BASE}/home-inaweek.png`,
    alt: "Home one week before a trip to Honolulu: the trip card with flight details, followed by suggested activities and places to eat",
  },
  {
    label: "1 day before",
    src: `${IMAGE_BASE}/home-tomorrow.png`,
    alt: "Home the day before the trip: the trip card with flight details, a prompt to check in for the flight, and tomorrow's plan",
  },
  {
    label: "On the trip",
    src: `${IMAGE_BASE}/home-ontrip.png`,
    alt: "Home during the trip: a map of saved places nearby, hotel check-in details, directions to the hotel, and today's weather",
  },
];

function TripTimeline() {
  const [stop, setStop] = useState(0);

  return (
    <figure className="flex w-full flex-col gap-sm items-center">
      {/* All screens are stacked and cross-faded, so switching never flashes
          and the slider below never moves. */}
      <div className="relative aspect-[1179/2556] w-full max-w-[280px] overflow-hidden rounded-[32px] border-[1px] border-border-default">
        {STOPS.map((s, i) => (
          <img
            key={s.label}
            src={s.src}
            alt={i === stop ? s.alt : ""}
            aria-hidden={i !== stop}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${
              i === stop ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3xs">
        <div>
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={STOPS.length - 1}
              step={1}
              value={stop}
              onChange={(e) => setStop(Number(e.target.value))}
              aria-label="Moment in the trip"
              aria-valuetext={STOPS[stop].label}
              className="w-full cursor-pointer accent-border-stardrift"
            />
            {/* A dot at each stop. The thumb's center travels between 8px in
              from each end, so the dots are placed along that same span. */}
            {STOPS.map((s, i) =>
              i === stop ? null : (
                <span
                  key={s.label}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-border-stardrift bg-bg-white"
                  style={{
                    left: `calc(8px + (100% - 16px) * ${
                      i / (STOPS.length - 1)
                    })`,
                  }}
                />
              ),
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4xs">
          {STOPS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setStop(i)}
              aria-pressed={i === stop}
              className={`rounded-md px-4xs py-5xs text-center text-sm leading-tight ${
                i === 0
                  ? "justify-self-start"
                  : i === STOPS.length - 1
                    ? "justify-self-end"
                    : "justify-self-center"
              } ${
                i === stop
                  ? "bg-[#EEEEF4] font-bold text-text-default"
                  : "text-text-subtle hover:text-text-default"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}

export default TripTimeline;
