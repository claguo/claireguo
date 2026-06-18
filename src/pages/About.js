import React, { useLayoutEffect } from "react";
import Section from "../components/general/Section";
import LoveCards from "../components/custom/LoveCards";
import ButtonLink from "../components/general/ButtonLink";

function AboutPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <section className="px-xs lg:px-[20px] flex flex-col pt-3xl pb-lg w-screen overflow-hidden">
      <div className="flex flex-col-reverse lg:flex-row lg:gap-md pb-xl gap-sm lg:gap-xl w-full">
        <div className="flex flex-col lg:gap-md gap-sm max-w-[405px]">
          <p className="text-sm text-left">
            I'm Claire, a product designer passionate about building social
            equity through design. At the core of my design practice is a desire
            to learn about and work with a diverse range of people and problems
            to enable me to create more empathetic and inclusive designs.
          </p>
          <div className="text-sm text-left">
            Currently at{" "}
            <ButtonLink
              variant="inline"
              text="Stardrift AI"
              to="https://stardrift.ai"
              target="_blank"
            />
            . Previously at{" "}
            <ButtonLink
              variant="inline"
              text="Mochi Health"
              to="https://joinmochi.com/"
              target="_blank"
            />{" "}
            and{" "}
            <ButtonLink
              variant="inline"
              text="RISD"
              to="https://www.risd.edu/"
              target="_blank"
            />{" "}
            <ButtonLink
              variant="inline"
              text="Industrial Design"
              to="https://id.risd.edu/"
              target="_blank"
            />{" "}
            +{" "}
            <ButtonLink
              variant="inline"
              text="Computation"
              to="https://ctc.risd.edu/"
              target="_blank"
            />
            .
          </div>
          <div className="flex flex-col gap-0">
            <ButtonLink
              variant="inline"
              text="claireguo@gmail.com"
              onClick={() => (window.location = "mailto:claireguo@gmail.com")}
            />
            <ButtonLink
              variant="inline"
              text="github"
              to="https://github.com/claguo"
              target="_blank"
            />
            <ButtonLink
              variant="inline"
              text="linkedin"
              to="https://www.linkedin.com/in/claguo"
              target="_blank"
            />
          </div>

          <span className="text-md">*</span>
        </div>
        <img
          src="https://images.claireguo.com/about/pfp.jpg"
          alt="Me, holding my cat, Benny"
          className="object-cover object-[0%_33%] lg:object-center max-h-[240px] lg:max-h-none w-full lg:w-[20%] rounded-[4px]"
        />
      </div>

      <Section tagText="Outside of the studio, I am..." project="blooms">
        <LoveCards />
      </Section>
    </section>
  );
}

export default AboutPage;
