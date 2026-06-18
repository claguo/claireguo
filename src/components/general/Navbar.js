import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SplitHover from "../custom/SplitHoverEffects";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import Clicksplosion from "../custom/Clicksplosion";
import { useLocation } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";

function Navbar() {
  const location = useLocation();
  const [active, setActive] = useState(null);
  const [show, setShow] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        // Set a threshold to ignore tiny scroll movements / bounce effects
        const threshold = 5;

        if (currentScrollY > lastScrollY + threshold) {
          // Scrolling down — hide nav
          setShow(false);
        } else if (
          currentScrollY < lastScrollY - threshold ||
          currentScrollY <= threshold
        ) {
          // Scrolling up or near top — show nav
          setShow(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar, { passive: true });

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  function MobileOverlay(props) {
    return (
      <div className="pt-3xs fixed w-full h-screen bg-bg-gray flex flex-col items-end">
        <Button variant="ghost" onClick={() => setShowOverlay(false)}>
          <IoCloseSharp className="text-[20px]" />
        </Button>

        <div className="flex flex-col w-full h-full justify-center items-center gap-8">
          <ButtonLink
            variant="ghost"
            to="/2026"
            onClick={() => setShowOverlay(false)}
            text={props.active === "/2026" ? "* home" : "home"}
          />
          <ButtonLink
            variant="ghost"
            to="/2026/about"
            onClick={() => setShowOverlay(false)}
            text={props.active === "/2026/about" ? "* about" : "about"}
          />
          <ButtonLink
            variant="ghost"
            text="resume"
            to="https://docs.claireguo.com/Claire_Guo_resume-protected.pdf"
            target="_blank"
            icon={<MdLockOutline />}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <>
          <div
            className={`lg:px-4xs pt-3xs flex justify-between items-center z-99 w-full transition duration-100 ease-in flex fixed bg-white ${
              show ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              to="/2026"
              className="flex flex-row gap-2xs px-xs pt-3xs items-center cursor-pointer"
            >
              <span className="font-mono italic tracking-normal text-[1.25rem]">
                {" "}
                claire
              </span>
              <span className="font-sans text-[1.25rem]">*</span>
              <span className="font-mono italic tracking-normal text-[1.25rem]">
                {" "}
                guo
              </span>
            </Link>
            <Button variant="ghost" onClick={() => setShowOverlay(true)}>
              <IoMdMenu className="text-[20px]" />
            </Button>
          </div>
          {showOverlay && <MobileOverlay active={active} />}
        </>
      ) : (
        <div
          className={`flex w-full px-4xs pt-3xs justify-between fixed transition duration-100 ease-in ${
            active === "/2026" ? "bg-bg-gray" : "bg-bg-white"
          } ${show ? "opacity-100" : "opacity-0"}`}
        >
          <Clicksplosion>
            <Link
              to="/2026"
              className="text-md flex flex-row lg:flex-row gap-2xs px-xs py-3xs items-center cursor-pointer"
            >
              <SplitHover
                text="claire"
                styling="italic"
                className="font-mono text-md"
              />
              *
              <SplitHover
                text="guo"
                styling="italic"
                className="font-mono text-md"
              />
            </Link>
          </Clicksplosion>

          <div className="flex gap-xl">
            <ButtonLink variant="ghost" text="work" to="/2026" />
            <ButtonLink variant="ghost" text="about" to="/2026/about" />
            <ButtonLink
              variant="ghost"
              text="resume"
              to="https://docs.claireguo.com/Claire_Guo_resume-protected.pdf"
              target="_blank"
              icon={<MdLockOutline />}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
