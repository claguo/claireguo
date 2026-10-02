import React from "react";

// source pixel sizes, so every pot is drawn at the same scale as the others
export const POTS = [
  { id: 1, width: 861, height: 912, alt: "speckled blue cup" },
  { id: 2, width: 1163, height: 1320, alt: "ceramic horse" },
  { id: 3, width: 1203, height: 1560, alt: "white cup with grey dots" },
  { id: 4, width: 1452, height: 847, alt: "wide tan bowl" },
  { id: 5, width: 1276, height: 1676, alt: "upturned dark cup" },
  { id: 6, width: 1038, height: 1303, alt: "dark cup with white dashes" },
];
export const HORSE = POTS[1];

const SCALE = 0.25;
const WIDEST = Math.max(...POTS.map((pot) => pot.width));
// on narrow screens the widest pot takes this much of the viewport and the
// rest shrink by the same factor
const WIDEST_VW = 80;

// css width of a pot, shared so callers can position around it. `scale`
// enlarges one pot on its own page without changing the shared proportions
export const potWidth = (pot, scale = 1) =>
  `min(${pot.width * SCALE * scale}px, ${(
    (pot.width / WIDEST) *
    WIDEST_VW
  ).toFixed(2)}vw)`;

function Pot({ pot, className = "", style, ...props }) {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/pots/${pot.id}.webp`}
      alt={pot.alt}
      width={pot.width}
      height={pot.height}
      className={`block h-auto max-w-none ${className}`}
      style={{ width: potWidth(pot), ...style }}
      {...props}
    />
  );
}

export default Pot;
