import React from "react";
import Section from "../general/Section";
import TripTimeline from "./TripTimeline";

function StardriftHome() {
  return (
    <Section tagText="a proactive travel assistant" project="stardrift">
      <div className="flex flex-col gap-4">
        <span className="text-center mt-sm lg:mt-md mx-xs lg:mx-2xl text-md">
          A context-aware, dynamic Home tab
        </span>
        <p className="text-center">
          The Home tab used to be a static list of trips and chat history. Now
          it's a feed of blocks that changes with where you are in a trip, where
          you are physically, and what time it is, giving users quick access to
          the most relevant information.
        </p>
      </div>
      <TripTimeline />
      <div className="flex flex-col gap-4">
        <span className="text-center mt-sm lg:mt-md mx-xs lg:mx-2xl text-md">
          The Block Library
        </span>
        <p className="text-center">
          Every block has a trigger and an expiration, so nothing shows up early
          and nothing lingers.
        </p>
        <img
          src="https://images.claireguo.com/stardrift/homeblocklibrary.png"
          alt="The Block Library table: each Home block with its section, trigger, expiration, and whether it is dismissible or sends a push notification"
          className="w-full border-[1px] border-border-default rounded-[12px]"
        />
      </div>
    </Section>
  );
}

export default StardriftHome;
