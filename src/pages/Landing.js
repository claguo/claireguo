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

function InlineLoveCard({ text, src }) {
  const [isHovered, setIsHovered] = useState(false);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [refImg, { width: imgWidth, height: imgHeight }] = useSize();
  const imgX = isHovered ? mouseX - (imgWidth || 0) / 2 : -1000;
  const imgY = isHovered ? mouseY - (imgHeight || 0) / 2 : -1000;

  return (
    <>
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`cursor-default transition-colors relative z-10 ${
          isHovered ? "text-pink-light not-italic" : ""
        }`}
      >
        {text}
      </span>
      <img
        className={`z-0 fixed top-0 left-0 pointer-events-none absolute max-w-[600px] max-h-[600px] object-contain ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        src={src}
        ref={refImg}
        alt={text}
        style={{
          transform: `translate(${imgX}px, ${imgY}px)`,
        }}
      />
    </>
  );
}

function ContactLink({ text, href, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-white hover:text-pink-light transition-colors cursor-pointer"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {text}
    </a>
  );
}

const activities = [
  { text: "hanging out with benny", src: "https://images.claireguo.com/about/benny.png" },
  { text: "sitting in the grass", src: "https://images.claireguo.com/about/grass.jpeg" },
  { text: "waiting for it to snow", src: "https://images.claireguo.com/about/snow.jpg" },
  { text: "eating honey bunches of oats", src: "https://images.claireguo.com/about/cereal.png" },
  { text: "learning debussy's arabesques", src: "https://images.claireguo.com/about/debussy.jpg" },
  { text: "reading OUT by natsuo kirino", src: "https://images.claireguo.com/about/out.webp" },
  { text: "listening to fruit fly by leah dou", src: "https://images.claireguo.com/about/fruitfly.png"}
];

function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white text-md font-kosugi px-xs lg:px-md py-lg flex flex-col justify-center">
        <p className="mb-lg">hi, i'm <span className="text-pink-light">claire &#9787;</span></p>

        <p className="mb-3xs">
          i'm building{" "}
          <a
            href="https://stardrift.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-light"
          >
            stardrift
          </a>
          {" "}★
        </p>

        <p className="text-[#8f8f8f] mb-lg">
          and{" "}
          {activities.map((activity, index) => (
            <span key={activity.text}>
              <InlineLoveCard text={activity.text} src={activity.src} />
              {index < activities.length - 1 && <span>, </span>}
            </span>
          ))}
        </p>

        <div className="flex flex-col gap-1">
          <ContactLink
            text="email"
            onClick={(e) => {
              e.preventDefault();
              window.location = "mailto:claireguo@gmail.com";
            }}
            href="#"
          />
          <ContactLink text="linkedin" href="https://www.linkedin.com/in/claguo" />
          <ContactLink text="github" href="https://github.com/claguo" />
        </div>
    </div>
  );
}

export default Landing;
