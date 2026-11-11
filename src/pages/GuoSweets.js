import React from "react";
import ProjectHero from "../components/ProjectHero";
import ProjectSummary from "../components/ProjectSummary";
import SecondaryPage from "../components/general/SecondaryPage";
import ContentWrapper from "../components/general/ContentWrapper";
import Section from "../components/general/Section";

const PAGES = [
  "Cover",
  "Colophon",
  "Title page with an illustration of my mom and me",
  "Egg tarts title page",
  "Egg tart recipe with ingredients and instructions",
  "Cake roll recipe with ingredients and instructions",
  "Cake rolls title page",
  "Snowflake crisps title page",
  "Snowflake crisp recipe with ingredients and instructions",
  "Soybean rice balls title page",
  "Soybean rice ball recipe with ingredients and instructions",
];

const pageSrc = (index) =>
  `/images/guo-sweets/zine-${String(index + 1).padStart(2, "0")}.png`;

function GuoSweetsPage() {
  const [cover, ...spreads] = PAGES;

  return (
    <SecondaryPage>
      <ProjectHero />
      <ContentWrapper>
        <Section tagText="tl;dr">
          <p>
            Recipes for my favorite homemade desserts made by my mom, compiled
            into a zine! A typography and layout exercise with my illustrations.
          </p>
          <ProjectSummary />
        </Section>
        <Section tagText="The zine">
          {/* cover sits on the right, like the first page of a printed spread */}
          <div className="grid grid-cols-2 gap-y-xs">
            <img
              className="col-start-2"
              src={pageSrc(0)}
              alt={`Page 1: ${cover}`}
              loading="lazy"
            />
            {spreads.map((alt, i) => (
              <img
                key={alt}
                src={pageSrc(i + 1)}
                alt={`Page ${i + 2}: ${alt}`}
                loading="lazy"
              />
            ))}
          </div>
        </Section>
      </ContentWrapper>
    </SecondaryPage>
  );
}

export default GuoSweetsPage;
