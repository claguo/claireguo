import React from "react";
import Section from "../general/Section";

const PAIN_POINTS = [
  {
    title: "Discovery was left to chance.",
    body: "Users didn't know what they didn't know. Valuable insights, from weather warnings to itinerary conflicts, were only discovered if users happened to ask the right questions.",
  },
  {
    title: "The mobile experience lacked context.",
    body: "Stardrift's mobile experience mirrored the trip-planning website, but travelers were opening the app on-the-go, looking for information relevant to where they were and what they needed in that moment.",
  },
];

function StardriftProblem() {
  return (
    <Section tagText="the problem" project="stardrift">
      <p>
        As we spoke with users, we learned that our chatbot-first experience put
        too much of the work on users. They had to know how to prompt the agent
        to get useful information, but some of the most valuable travel insights
        were things they didn't know to look for in the first place.
      </p>
      <p>
        If we wanted to reduce the mental effort of planning and traveling, we
        needed to take on some of that work ourselves. Instead of asking how to
        better answer users' prompts, we started asking: Where do travelers get
        stuck? What can we anticipate? What would help them spend less time
        figuring things out and more time enjoying their trip?
      </p>
      <div className="flex flex-col lg:flex-row gap-xs w-full">
        {PAIN_POINTS.map((point, index) => (
          <div
            key={point.title}
            className="flex flex-col gap-3xs flex-1 p-5 border border-border-default rounded-md"
          >
            <span className="font-mono text-sm text-text-subtle">
              Pain point {String(index + 1)}
            </span>
            <h3 className="font-semibold text-text-stardrift">{point.title}</h3>
            <p className="text-text-default">{point.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default StardriftProblem;
