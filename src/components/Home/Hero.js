import React from "react";
import ButtonLink from "../general/ButtonLink";
import { MdArrowOutward } from "react-icons/md";

function Hero() {
  return (
    <div className="flex flex-col pt-3xl px-xs lg:px-[20px] pb-lg lg:pb-[120px] lg:gap-md gap-sm max-w-[405px]">
      <div className="text-sm">
        Building AI-powered travel planning at
        <ButtonLink
          variant="inline"
          to="https://stardrift.ai"
          target="_blank"
          text="&nbsp;Stardrift"
        />
        . BFA in
        <ButtonLink
          variant="inline"
          to="https://id.risd.edu/"
          target="_blank"
          text="&nbsp;Design&nbsp;"
        />
        and
        <ButtonLink
          variant="inline"
          to="https://ctc.risd.edu/"
          target="_blank"
          text="Computation&nbsp;"
        />
        at RISD.
      </div>
      <div className="flex flex-col gap-0">
        <ButtonLink
          variant="inline"
          text="claireguo@gmail.com"
          onClick={() => (window.location = "mailto:claireguo@gmail.com")}
          icon={<MdArrowOutward />}
        />
        <ButtonLink
          variant="inline"
          text="github"
          url="https://github.com/claguo"
          icon={<MdArrowOutward />}
        />
        <ButtonLink
          variant="inline"
          text="linkedin"
          url="https://www.linkedin.com/in/claguo"
          icon={<MdArrowOutward />}
        />
      </div>
    </div>
  );
}

export default Hero;
