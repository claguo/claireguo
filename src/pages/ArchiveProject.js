import React from "react";
import { useLocation } from "react-router-dom";
import ProjectHero from "../components/ProjectHero";
import ProjectSummary from "../components/ProjectSummary";
import SecondaryPage from "../components/general/SecondaryPage";
import ContentWrapper from "../components/general/ContentWrapper";
import Section from "../components/general/Section";
import { useProjectContext } from "../context/ProjectContext";

// summary-only page for archived projects without a full write-up
function ArchiveProjectPage() {
  const path = useLocation().pathname.split("/").filter(Boolean).pop();
  const project = useProjectContext().find((project) => project.path === path);

  if (!project) return null;

  return (
    <SecondaryPage>
      <ProjectHero />
      <ContentWrapper>
        <Section tagText="tl;dr">
          <p>{project.description}</p>
          <ProjectSummary />
        </Section>
      </ContentWrapper>
    </SecondaryPage>
  );
}

export default ArchiveProjectPage;
