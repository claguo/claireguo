import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import posthog from "../../posthog";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
const PAGES = NUMBERS.map(
  (n) => `${process.env.PUBLIC_URL}/sketchbook/${n}.png`,
);
// full resolution, only fetched once the fullscreen view is opened
const FULL_PAGES = NUMBERS.map(
  (n) => `${process.env.PUBLIC_URL}/sketchbook/full/${n}.webp`,
);
const INTERVAL_MS = 2000;
const ASPECT = 960 / 739;
const OPEN_MS = 350;

function ArrowButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center text-white hover:text-pink-light transition-colors"
    >
      {children}
    </button>
  );
}

function Sketchbook() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const thumbRef = useRef(null);
  const backdropRef = useRef(null);
  const stageRef = useRef(null);
  const barRef = useRef(null);

  const step = useCallback(
    (delta) => setIndex((i) => (i + delta + PAGES.length) % PAGES.length),
    [],
  );

  const handleOpen = () => {
    posthog.capture("sketchbook_opened");
    setOpen(true);
  };

  useEffect(() => {
    if (paused || open) return;
    const id = setInterval(() => step(1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, open, step]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, step]);

  // grow the page from where the thumbnail sits to its fullscreen size
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!open || !stage?.animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const from = thumbRef.current.getBoundingClientRect();
    const box = stage.getBoundingClientRect();
    // where object-contain puts the page inside the stage
    const width = Math.min(box.width, box.height * ASPECT);
    const left = (box.width - width) / 2;
    const top = (box.height - width / ASPECT) / 2;
    const scale = from.width / width;
    const x = from.left - box.left - left * scale;
    const y = from.top - box.top - top * scale;

    const timing = { duration: OPEN_MS, easing: "cubic-bezier(0.2, 0, 0, 1)" };
    stage.animate(
      [
        { transform: `translate(${x}px, ${y}px) scale(${scale})` },
        { transform: "none" },
      ],
      timing,
    );
    const fade = [{ opacity: 0 }, { opacity: 1 }];
    backdropRef.current.animate(fade, timing);
    barRef.current.animate(fade, timing);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="open sketchbook fullscreen"
        ref={thumbRef}
        className={`relative block w-[480px] max-w-full aspect-[960/739] cursor-pointer ${
          open ? "invisible" : ""
        }`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={handleOpen}
      >
        {/* all pages stay mounted so swapping never waits on a load */}
        {PAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === index ? "sketchbook page" : ""}
            className={`absolute inset-0 h-full w-full ${
              i === index ? "" : "invisible"
            }`}
          />
        ))}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="sketchbook"
          className="fixed inset-0 z-50 flex flex-col cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <div ref={backdropRef} className="absolute inset-0 bg-[#0B0A0F]" />
          <div
            ref={stageRef}
            className="relative min-h-0 flex-1 origin-top-left"
          >
            {/* the small page shows through until the full one has loaded */}
            <img
              src={PAGES[index]}
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
            />
            <img
              key={FULL_PAGES[index]}
              src={FULL_PAGES[index]}
              alt="sketchbook page"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div
            ref={barRef}
            className="relative grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 px-xs pb-4 text-sm text-[#8f8f8f] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <span>midori A6, 2026</span>
            <div className="flex items-center gap-4">
              <ArrowButton label="previous sketch" onClick={() => step(-1)}>
                <LuArrowLeft className="size-5" />
              </ArrowButton>
              <span>
                {index + 1} / {PAGES.length}
              </span>
              <ArrowButton label="next sketch" onClick={() => step(1)}>
                <LuArrowRight className="size-5" />
              </ArrowButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sketchbook;
