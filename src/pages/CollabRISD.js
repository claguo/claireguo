import React from "react";
import ProjectHero from "../components/ProjectHero";
import ProjectSummary from "../components/ProjectSummary";
import SecondaryPage from "../components/general/SecondaryPage";
import ContentWrapper from "../components/general/ContentWrapper";
import Section from "../components/general/Section";
import TextStack from "../components/general/TextStack";
import ButtonLink from "../components/general/ButtonLink";
import NextSteps from "../components/custom/NextSteps";

const EVENTS = [
  {
    name: "Meet: Speed Date",
    when: "Sunday, April 16, 4PM @ Upper Quad MET Room B",
    body: "A fun, casual meetup for students to find collaborators or brainstorm new ideas. I designed the event posters, prompt cards to spark conversations, and attendee profile cards to exchange contact information at the end.",
  },
  {
    name: "Learn: Roundtable",
    when: "Sunday, April 23, 7PM @ Taproom, Memorial Hall 4F",
    body: "We invited student club leaders and others who have worked on collaborative projects to speak about their experiences: the challenges they faced, how they found collaborators, and what they learned. Speakers got exposure for their projects and a chance to recruit new collaborators. I designed the event poster and social media posts.",
  },
  {
    name: "Discover: Project Fair",
    when: "Sunday, April 30, 4PM @ 20 Washington Place Lobby",
    body: "A decentralized event: we built five free-standing boards displaying projects submitted by students, then placed them around RISD and Brown (including the Brown Design Workshop, the Brown CS building, and Carr Haus Cafe) to advertise ongoing projects and new ideas. I designed the poster and display boards.",
  },
];

const IMPACT = [
  "Wendy launched RISD's first Taxidermy Club with collaborators.",
  "Jenny, a product designer, partnered with an engineer at Brown to bring technical expertise to her personal project.",
  "Yue is planning a Collaborative Study Project with people she met at the Speed Date.",
  "Yuqing recruited Earthling Lab members from both RISD and Brown, across majors, with a shared interest in sustainability research.",
  "6 people are interested in carrying on this project (Collab @ RISD) next year!",
];

function CollabRISDPage() {
  return (
    <SecondaryPage>
      <ProjectHero />
      <ContentWrapper>
        <Section tagText="tl;dr">
          <p>
            A semester-long, student-led Collaborative Study Project, during
            which a group of industrial and graphic designers and I sought to
            increase interdisciplinary collaboration at RISD and Brown. Over
            four months, we designed, tested, and implemented two solutions: a
            series of three local events to facilitate connection, and a
            digital archive for outreach and information sharing.
          </p>
          <ProjectSummary />
        </Section>
        <Section tagText="Impact">
          <p>Connections created; projects launched!</p>
          <ul className="flex flex-col gap-5xs">
            {IMPACT.map((item) => (
              <li key={item} className="flex gap-3xs">
                <span className="text-[16px]">*</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </Section>
        <Section tagText="The problem">
          <TextStack
            header="RISD course curriculum discourages collaboration."
            className="font-medium"
          >
            <p>
              We observed a need for a platform that facilitates collaboration,
              empowering students to collectively develop projects that are
              more innovative, impactful, and meaningful than what an
              individual could achieve alone. We spoke to student creators from
              a variety of schools to find out how they collaborate and where
              they find inspiration.
            </p>
          </TextStack>
        </Section>
        <Section tagText="Solution 1: three local events">
          <p>
            A series of three events, each with a different purpose, to help
            students understand how to collaborate at RISD and kickstart
            collaborative projects. We imagine them running annually near the
            end of the spring semester, ahead of summer projects and the next
            fall's Collaborative Study Projects.
          </p>
          {EVENTS.map((event) => (
            <TextStack
              key={event.name}
              header={event.name}
              className="font-medium"
            >
              <span className="font-mono text-sm tracking-normal text-text-subtle">
                {event.when}
              </span>
              <p>{event.body}</p>
            </TextStack>
          ))}
        </Section>
        <Section tagText="Solution 2: digital archive">
          <TextStack
            header="A digital archive of projects looking for collaborators, plus collaboration resources."
            className="font-medium"
          >
            <p>
              Moving online made our resources accessible to anyone, around the
              clock, free from the time and location constraints of events.
            </p>
          </TextStack>
          <ButtonLink
            variant="inline"
            text="View our Notion page"
            to="https://lily-sandalwood-e02.notion.site/Cabinet-of-Collaboration-634ebe90250b40f5a04e9c2cf380bdf9?pvs=4"
            target="_blank"
          />
        </Section>
        <NextSteps
          steps={[
            "This was the first time any of us had hosted an event, and we underestimated how much planning each would take. We would have liked to run mock prototyping events for all three, not just the Speed Date.",
            "We hope next year's events go more smoothly based on what we learned.",
            "For the digital archive, next steps are advertising the Notion page more and filling in the resource sections.",
          ]}
        />
      </ContentWrapper>
    </SecondaryPage>
  );
}

export default CollabRISDPage;
