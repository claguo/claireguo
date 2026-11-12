import React from "react";
import Section from "../general/Section";
import ProjectSummary from "../ProjectSummary";
import Callout from "../general/Callout";

function StardriftTLDR() {
  return (
    <Section tagText="tl;dr" project="stardrift">
      <p>
        Stardrift is an AI-powered travel planner that started as a simple
        chatbot. During my time there, I helped transform it into a proactive
        travel assistant that learns users’ preferences and{" "}
        <span className="text-text-stardrift font-semibold">
          anticipates their needs
        </span>
        . I designed and implemented a{" "}
        <span className="text-text-stardrift font-semibold">
          system of context-aware UI blocks
        </span>{" "}
        that surfaced timely recommendations, trip reminders, and useful
        discoveries on the home screen, bringing the right information to users
        before they know to ask for it.
      </p>
      <ProjectSummary />
      <Callout title="My role">
        <p>
          I owned the end-to-end design of the proactive UI system, from
          defining the content block system to designing the triggers and
          expiration rules that determined when each block appeared and
          disappeared. I implemented most of the blocks myself, surfacing
          existing trip data in more useful ways, and collaborated with
          engineers to build the recommendation engine that translated user
          preferences into personalized suggestions.
        </p>
      </Callout>
      <Callout title="Outcome">
        <p>
          New mobile users came back in week 4 at about four times the rate of
          web users (13% vs 3%).
        </p>
      </Callout>
    </Section>
  );
}

export default StardriftTLDR;
