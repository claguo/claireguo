import React, { useState, useEffect, useCallback } from "react";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return mousePosition;
};

const useSize = () => {
  const [dimensions, setDimensions] = useState({});
  const ref = useCallback((node) => {
    if (node) {
      const measure = () => {
        const rect = node.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        });
      };

      if (node.complete) {
        measure();
      } else {
        node.onload = () => measure();
      }
    }
  }, []);

  return [ref, dimensions];
};

function LoveCard(props) {
  const [isHovered, setIsHovered] = useState(false);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [refImg, { width: imgWidth, height: imgHeight }] = useSize();
  const imgX = isHovered ? mouseX - imgWidth / 2 : -1000;
  const imgY = isHovered ? mouseY - imgHeight / 2 : -1000;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile)
    return (
      <div className="w-auto shrink-0 flex flex-col gap-2xs items-center">
        <img className="w-[200px] grow-0" src={props.src} alt={props.text} />

        <div className="flex cursor-default gap-3xs grow-0 shrink-1">
          <span className="font-sans text-md">*</span>
          <p className="font-mono tracking-normal mt-[1px]">{props.text}</p>
        </div>
      </div>
    );

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex cursor-default gap-3xs w-full tracking-normal ${
          isHovered ? "text-pink" : ""
        }`}
      >
        <span className="font-sans text-md">*</span>
        <p className="font-mono tracking-normal mt-[1px]">{props.text}</p>
      </div>

      <img
        className={`-z-10 fixed top-0 left-0 pointer-events-none absolute max-w-[600px] max-h-[600px] object-contain ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        src={props.src}
        ref={refImg}
        alt={props.text}
        style={{
          transform: `translate(${imgX}px, ${imgY}px)`,
        }}
      />
    </>
  );
}

export default LoveCard;
