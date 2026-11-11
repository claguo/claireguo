import React from "react";
import ProjectHero from "../components/ProjectHero";
import ProjectSummary from "../components/ProjectSummary";
import SecondaryPage from "../components/general/SecondaryPage";
import ContentWrapper from "../components/general/ContentWrapper";
import Section from "../components/general/Section";
import TextStack from "../components/general/TextStack";

const WORK = [
  {
    name: "Model runner dashboard",
    content: [
      {
        header:
          "A tool that allows developers and analysts to quickly identify which models are failing and why.",
        paragraph:
          "The model runner dashboard displays the failure and success rates of the Astros' data models so that developers and analysts can monitor their models without needing to write backend queries. My design displays tables of data about individual model runs in an easily readable way.",
      },
      {
        header: "Merging differing expectations into one unified design.",
        paragraph:
          "I held meetings with end users (developers and analysts) to learn about what they need for an improved model-monitoring experience. One challenge during this process was that different users had different ideas about what the tool should include, and I worked to combine their various ideas into one.",
      },
    ],
  },
  {
    name: "Scouting report",
    content: [
      {
        header: "Redesigning the player evaluation form for baseball scouts.",
        paragraph:
          "After meeting with Astros scouts to discuss the design of the old scouting report and their visions for a redesigned version, I designed a new form, eliminating redundancies in the flow and improving visual clarity. I also updated the UI with a more contemporary visual style.",
      },
    ],
  },
  {
    name: "Data visualization",
    content: [
      {
        header:
          "Improving the display of the immense amounts of information in the Astros databases.",
        paragraph:
          "I used box plots, line graphs, two-way tables, and color to redesign the way data is displayed in several different parts of the Astros internal website.",
      },
    ],
  },
  {
    name: "Frontend engineering",
    content: [
      {
        header: "Implementing my designs and fixing bugs.",
        paragraph:
          "I used React to help bring three of my designs from Figma to the web. I also fixed several frontend bugs in different areas of the website.",
      },
    ],
  },
  {
    name: "Updating UI",
    content: [
      {
        header: "Redesigning outdated UI across the Astros' internal website.",
      },
    ],
  },
];

function AstrosPage() {
  return (
    <SecondaryPage>
      <ProjectHero />
      <ContentWrapper>
        <Section tagText="tl;dr">
          <p>
            During Summer 2023, I designed new features for the Houston Astros
            baseball team's internal website, which contains immense amounts of
            detailed data for thousands of players, games, and pitches.
          </p>
          <ProjectSummary />
          <p className="text-sm text-text-subtle">
            * This work is under NDA. For more information, shoot me an email or
            message me on LinkedIn!
          </p>
        </Section>
        {WORK.map((item) => (
          <Section key={item.name} tagText={item.name}>
            {item.content.map((block) => (
              <TextStack
                key={block.header}
                header={block.header}
                className="font-medium"
              >
                {block.paragraph && <p>{block.paragraph}</p>}
              </TextStack>
            ))}
          </Section>
        ))}
      </ContentWrapper>
    </SecondaryPage>
  );
}

export default AstrosPage;
