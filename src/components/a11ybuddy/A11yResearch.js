import React from "react";
import Section from "../general/Section";
import UserPersona from "../custom/UserPersona";
import TextStack from "../general/TextStack";
import Card from "../general/Card";

function A11yResearch() {
  return (
    <Section tagText="Research" project="a11y">
      <div className="flex flex-col lg:flex-row gap-xs">
        <UserPersona
          name="Ariel, 22"
          expNum={1}
          motNum={3}
          quote='"I want to make our website inclusive, even though I’m still
          learning."'
          p="Ariel, a recent computer science graduate, is redesigning her
          company's website. Aware of its lack of accessibility, she's eager to
          improve it, even as she learns the principles to make effective
          changes."
          memojiSrc="https://images.claireguo.com/a11y/personas/ariel.png"
          softwareSrc="https://images.claireguo.com/a11y/personas/ariel_software.png"
          softwareAlt="VSCode, React, Stardew Valley"
        />
        <UserPersona
          name="Kevin, 28"
          expNum={3}
          motNum={1}
          quote='"Web accessibility is time-consuming and annoying."'
          p="Kevin, an experienced software engineer, views web accessibility as a chore. He often ignores ESLint warnings, believing the impact doesn’t justify extra efforts, prioritizing functionality over accessibility."
          memojiSrc="https://images.claireguo.com/a11y/personas/kevin.png"
          softwareSrc="https://images.claireguo.com/a11y/personas/kevin_software.png"
          softwareAlt="VSCode, React, ESLint"
        />
      </div>

      {/* PAIN POINTS */}
      <div className="flex flex-col gap-md">
        <TextStack
          header="Pain point 1"
          className="font-mono tracking-normal text-text-subtle"
        >
          <p>
            <span className="text-text-a11y font-medium">
              Perceived low impact{" "}
            </span>
            – Software functionality is often prioritized over accessibility due
            to the perceived low impact of web accessibility.
          </p>
        </TextStack>
        <TextStack
          header="Pain point 2"
          className="font-mono tracking-normal text-text-subtle"
        >
          <p>
            <span className="text-text-a11y font-medium">
              Overwhelming rules and guidelines{" "}
            </span>
            – Software functionality is often prioritized over accessibility due
            to the perceived low impact of web accessibility.
          </p>
        </TextStack>
        <TextStack
          header="Pain point 3"
          className="font-mono tracking-normal text-text-subtle"
        >
          <p>
            <span className="text-text-a11y font-medium">
              Time-consuming debug process{" "}
            </span>
            – Existing tools like ESLint make accessibility seem difficult and
            time-consuming.
          </p>
        </TextStack>
      </div>

      {/* HOW MIGH WE QUESTION */}
      <span className="text-center my-md lg:my-lg mx-xs lg:mx-2xl text-md">
        How might we enable and encourage web developers to implement web
        accessibility?
      </span>

      {/* DESIGN PRINCIPLES */}
      <div className="flex flex-col gap-2xs lg:flex-row">
        <Card className="border-[1px] p-xs rounded-[4px] flex-1">
          <span className="font-mono tracking-normal text-text-subtle">
            Design Principle 1
          </span>
          <img
            src="https://images.claireguo.com/a11y/principle_tamagotchi.png"
            alt="Tamagotchi"
            className="h-[140px] object-contain"
          />
          <TextStack header="Fun" className="font-medium text-text-a11y">
            <p>
              To incentivize and engage overwhelmed developers, we decided to
              gamify, taking inspiration from Tamagotchi, Pokemon, and VSCode
              Pets.
            </p>
          </TextStack>
        </Card>
        <Card className="border-[1px] p-xs rounded-[4px] flex-1">
          <span className="font-mono tracking-normal text-text-subtle">
            Design Principle 2
          </span>
          <img
            src="https://images.claireguo.com/a11y/principle_sparkle.png"
            alt="Yellow sparkle icon"
            className="h-[140px] object-contain"
          />
          <TextStack header="Simple" className="font-medium text-text-a11y">
            <p>
              To minimize cognitive load to avoid hindering developer workflow.
            </p>
          </TextStack>
        </Card>
        <Card className="border-[1px] p-xs rounded-[4px] flex-1">
          <span className="font-mono tracking-normal text-text-subtle">
            Design Principle 3
          </span>
          <img
            src="https://images.claireguo.com/a11y/principle_vscode.png"
            alt="VSCode logo"
            className="h-[140px] object-contain"
          />
          <TextStack header="Proactive" className="font-medium text-text-a11y">
            <p>
              Keeping code accessible from the start of a project is far quicker
              than retroactively addressing accessibility errors.
            </p>
          </TextStack>
        </Card>
      </div>
    </Section>
  );
}

export default A11yResearch;
