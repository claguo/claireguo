import React from "react";
import ProjectHero from "../components/ProjectHero";
import TLDR from "../components/stardrift/StardriftTLDR";
import Problem from "../components/stardrift/StardriftProblem";
import Home from "../components/stardrift/StardriftHome";
import Results from "../components/stardrift/StardriftResults";
import ContentWrapper from "../components/general/ContentWrapper";
import SecondaryPage from "../components/general/SecondaryPage";

function Stardrift() {
  return (
    <SecondaryPage>
      <ProjectHero />
      <ContentWrapper>
        <TLDR />
        <Problem />
        <Home />
        <Results />
      </ContentWrapper>
    </SecondaryPage>
  );
}

export default Stardrift;
