import React, { useRef, useEffect } from "react";

const colours = ["#248EFF", "#FF6BE1", "#00CE7F"];
const shapes = ["*"];
const sparks = 40;
const bangs = 5;
const speed = 33;

function Clicksplosion({ children }) {
  const starsRef = useRef([]);
  const decayRef = useRef([]);
  const intensityRef = useRef([]);
  const XposRef = useRef([]);
  const YposRef = useRef([]);
  const dXRef = useRef([]);
  const dYRef = useRef([]);
  const timersRef = useRef([]);
  const countRef = useRef(0);

  const swide = window.innerWidth;
  const shigh = window.innerHeight;

  useEffect(() => {
    for (let i = 0; i < bangs * sparks; i++) {
      const div = document.createElement("div");
      div.style.position = "fixed";
      div.style.font = "18px";
      div.style.color = colours[i % colours.length];
      div.style.zIndex = 9999;
      div.style.visibility = "hidden";
      div.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      document.body.appendChild(div);
      starsRef.current[i] = div;
    }
  }, []);

  const bang = (N) => {
    let done = 0;
    for (let i = sparks * N; i < sparks * (N + 1); i++) {
      if (decayRef.current[i]) {
        const star = starsRef.current[i].style;
        XposRef.current[i] += dXRef.current[i];
        YposRef.current[i] += dYRef.current[i] +=
          1.25 / intensityRef.current[N];
        if (
          XposRef.current[i] >= swide ||
          XposRef.current[i] < 0 ||
          YposRef.current[i] >= shigh ||
          YposRef.current[i] < 0
        ) {
          decayRef.current[i] = 1;
        } else {
          star.left = `${XposRef.current[i]}px`;
          star.top = `${YposRef.current[i]}px`;
        }
        if (decayRef.current[i] === 15) star.fontSize = "7px";
        else if (decayRef.current[i] === 7) star.fontSize = "2px";
        else if (decayRef.current[i] === 1) star.visibility = "hidden";
        decayRef.current[i]--;
      } else done++;
    }
    if (done !== sparks)
      timersRef.current[N] = setTimeout(() => bang(N), speed);
  };

  const doClicksplosion = (e) => {
    const x = e.clientX; // ✅ was e.clientX
    const y = e.clientY; // ✅ was e.clientY
    const N = ++countRef.current % bangs;
    intensityRef.current[N] = 5 + Math.random() * 4;

    for (let i = N * sparks; i < (N + 1) * sparks; i++) {
      XposRef.current[i] = x;
      YposRef.current[i] = y;
      dYRef.current[i] = (Math.random() - 0.5) * intensityRef.current[N];
      dXRef.current[i] =
        (Math.random() - 0.5) *
        (intensityRef.current[N] - Math.abs(dYRef.current[i])) *
        1.25;
      decayRef.current[i] = 16 + Math.floor(Math.random() * 16);

      const star = starsRef.current[i].style;
      star.left = `${x}px`;
      star.top = `${y}px`;
      star.fontSize = "13px";
      star.visibility = "visible";
      star.color = colours[Math.floor(Math.random() * colours.length)];
    }

    clearTimeout(timersRef.current[N]);
    bang(N);
  };

  return (
    <div onClick={doClicksplosion} className="cursor-default">
      {children}
    </div>
  );
}

export default Clicksplosion;
