import React from "react";
import { Link } from "react-router-dom";
import Pot, { POTS, HORSE } from "../components/custom/Pot";

const WIDEST = Math.max(...POTS.map((pot) => pot.width));

// `bottom` is how far down its image each pot ends (the rest is transparent
// padding), so the label can sit right under the pot itself
const LABELS = {
  1: { text: "cup 2, floating blue @ hickory", bottom: 0.878 },
  2: { text: "horse", bottom: 0.883 },
  3: { text: "cup 1, colored slip polkadot", bottom: 0.746 },
  4: { text: "ikebana vase", bottom: 0.889 },
  5: { text: "cup 3, golden hour on b3", bottom: 0.787 },
  6: { text: "nerikomi test", bottom: 0.872 },
};

function Pots() {
  return (
    <div className="min-h-screen w-screen bg-[#0B0A0F] px-xs lg:px-md py-lg overflow-hidden font-kosugi text-xs text-[#8f8f8f]">
      <div className="grid max-w-[1200px] grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-4">
        {POTS.map((pot) => {
          const label = LABELS[pot.id];
          const image = <Pot pot={pot} style={{ width: "100%" }} />;
          return (
            // equal square cells; the widest pot fills its cell and the rest
            // keep their size relative to it. the taller images spill over
            // the cell edges, but only with their transparent padding
            <div
              key={pot.id}
              className="relative flex aspect-square items-center justify-center"
            >
              <div
                className="relative shrink-0"
                style={{ width: `${((pot.width / WIDEST) * 100).toFixed(2)}%` }}
              >
                {pot.id === HORSE.id ? (
                  // the horse leads back home, the way it led here
                  <Link to="/" aria-label="home">
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </div>
              {/* centred in the cell, just below where the pot ends */}
              <p
                className="absolute left-1/2 mt-3xs w-max max-w-full -translate-x-1/2 text-left"
                style={{
                  top: `${(
                    50 +
                    (pot.height / WIDEST) * (label.bottom - 0.5) * 100
                  ).toFixed(2)}%`,
                }}
              >
                {label.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Pots;
