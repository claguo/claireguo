import React from "react";
import { Link } from "react-router-dom";
import Pot, { POTS, HORSE } from "../components/custom/Pot";

const WIDEST = Math.max(...POTS.map((pot) => pot.width));

const cellStyle = (pot) => ({
  width: `${((pot.width / WIDEST) * 100).toFixed(2)}%`,
});

function Pots() {
  return (
    <div className="min-h-screen w-screen bg-[#0B0A0F] px-xs lg:px-md py-lg overflow-hidden">
      <div className="grid max-w-[1200px] grid-cols-2 sm:grid-cols-4">
        {POTS.map((pot) => (
          // equal square cells; the widest pot fills its cell and the rest
          // keep their size relative to it. the taller images spill over the
          // cell edges, but only with their transparent padding
          <div
            key={pot.id}
            className="flex aspect-square items-center justify-center"
          >
            {pot.id === HORSE.id ? (
              // the horse leads back home, the way it led here
              <Link to="/" aria-label="home" className="contents">
                <Pot pot={pot} className="shrink-0" style={cellStyle(pot)} />
              </Link>
            ) : (
              <Pot pot={pot} className="shrink-0" style={cellStyle(pot)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pots;
