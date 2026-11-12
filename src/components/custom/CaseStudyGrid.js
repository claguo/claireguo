import React from "react";
import { Link } from "react-router-dom";
import { useProjectContext } from "../../context/ProjectContext";
import posthog from "../../posthog";

// dark-landing take on ProjectCard: same data, links and analytics,
// restyled for the #0B0A0F background
function CaseStudyCard({ project }) {
  const to = project.protected ? "/login" : project.route;
  const state = project.protected ? { from: project.route } : null;

  return (
    <Link
      to={to}
      state={state}
      onClick={() =>
        posthog.capture("project_opened", {
          project_slug: project.path,
          requires_access: Boolean(project.protected),
          source: "landing",
        })
      }
      className="group flex flex-col gap-xs lg:flex-row lg:items-center lg:gap-md"
    >
      <div className="overflow-hidden rounded-sm aspect-[2757/1523] lg:w-1/3 lg:shrink-0">
        <img
          src={`https://images.claireguo.com/${project.project}-cover.png`}
          alt={project.alt}
          loading="lazy"
          className="w-full h-full object-cover duration-500 group-hover:scale-[1.015]"
        />
      </div>
      <div className="flex flex-col gap-3xs lg:flex-1 lg:max-w-[440px]">
        <p className="group-hover:text-pink-light transition-colors">
          {project.title}
        </p>
        <p className="font-sans text-[#8f8f8f] text-sm">
          {project.description}
        </p>
        <p className="text-[#8f8f8f] text-sm">
          {project.tags.map((tag) => tag.toLowerCase()).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

function CaseStudyGrid() {
  const projects = useProjectContext().filter((p) => !p.archiveOnly);

  return (
    <div className="flex flex-col gap-xl">
      {projects.map((project) => (
        <CaseStudyCard key={project.path} project={project} />
      ))}
    </div>
  );
}

export default CaseStudyGrid;
