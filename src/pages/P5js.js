import React from "react";
import ProjectHero from "../components/ProjectHero";
import ProjectSummary from "../components/ProjectSummary";
import SecondaryPage from "../components/general/SecondaryPage";
import ContentWrapper from "../components/general/ContentWrapper";
import Section from "../components/general/Section";

function P5jsPage() {
  return (
    <SecondaryPage>
      <ProjectHero />
      <ContentWrapper>
        <Section tagText="tl;dr">
          <p>
            My first time using p5.js! In these creative coding experiments, I
            played with color, line, transparency, and mouse interactivity to
            create meditative experiences.
          </p>
          <ProjectSummary />
        </Section>
        <Section tagText="My favorite sketch">
          <p>Click to lock a flower in place, and try to find the butterfly :)</p>
          <iframe
            title="My p5.js sketch on OpenProcessing"
            src="https://openprocessing.org/sketch/1931277/embed/"
            className="w-full h-[80vh] rounded-sm"
          />
        </Section>
      </ContentWrapper>
    </SecondaryPage>
  );
}

export default P5jsPage;
