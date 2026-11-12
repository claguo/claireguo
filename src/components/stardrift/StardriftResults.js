import React from "react";
import Section from "../general/Section";

const stats = [
  {
    value: "4.3×",
    title: "Week-4 retention",
    detail: "Mobile vs. web (13% vs. 3%)",
  },
  {
    value: "1.6×",
    title: "Week-1 retention",
    detail: "Mobile vs. web (19% vs. 12%)",
  },
];

// Transcribed from the App Store as written.
const reviews = [
  {
    title: "Practically Perfect",
    date: "Oct 3",
    author: "TXJen",
    body: "I’ve only been using Stardrift for a few months but I absolutely LOVE it and it has become indispensable for travel planning. I’m taking a bucket list trip to Japan next fall and I’m not exaggerating when I say Stardrift is making the trip possible. I was completely overwhelmed with trying to figure out where to go, whether transit times between locations on my proposed itinerary were reasonable, etc. It was a lot, but Stardrift very quickly learned my priorities and preferences and helped me craft a wonderful itinerary. It also helped me discover new places I hadn’t even considered, along with adjusting my plans to ensure I can visit a festival while I’m there. Definitely a must try app and the only travel app I need.",
  },
  {
    title: "Best app to plan my travels",
    date: "Aug 3",
    author: "ula324",
    body: "I used the app when I traveled to LA and found the best coffee shop!!",
  },
  {
    title: "Amazingly good",
    date: "Oct 16",
    author: "Athexs",
    body: "I tried using other apps like this, but nothing comes close to Star drift. I don’t normally review things, but this thing works so good. I just had to post a review",
  },
];

function Review({ review, className = "" }) {
  return (
    <figure
      className={`flex flex-col gap-3xs p-5 border border-border-default rounded-md ${className}`}
    >
      <h3 className="font-semibold text-text-default">{review.title}</h3>
      <figcaption className="flex flex-wrap items-center gap-3xs font-mono text-sm text-text-subtle">
        <span role="img" aria-label="5 out of 5 stars">
          ★★★★★
        </span>
        <span>
          {review.date} · {review.author}
        </span>
      </figcaption>
      <blockquote className="text-text-default">{review.body}</blockquote>
    </figure>
  );
}

function StardriftResults() {
  return (
    <Section tagText="results" project="stardrift">
      <div className="flex flex-col lg:flex-row gap-md lg:gap-xs">
        {stats.map((stat) => (
          <div key={stat.title} className="flex flex-col gap-sm flex-1">
            <span className="text-lg font-medium text-text-stardrift">
              {stat.value}
            </span>
            <div className="flex flex-col gap-5xs">
              <h3 className="font-semibold text-text-default">{stat.title}</h3>
              <p className="text-sm text-text-subtle">{stat.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-xs w-full">
        <span className="font-semibold">
          From the{" "}
          <a
            href="https://apps.apple.com/us/app/stardrift-travel/id6760489765"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-text-default"
          >
            App Store
          </a>
        </span>
        <div className="flex flex-col lg:flex-row gap-xs w-full">
          <Review review={reviews[0]} className="lg:flex-[3]" />
          <div className="flex flex-col gap-xs lg:flex-[2]">
            <Review review={reviews[1]} />
            <Review review={reviews[2]} />
          </div>
        </div>
      </div>
    </Section>
  );
}

export default StardriftResults;
