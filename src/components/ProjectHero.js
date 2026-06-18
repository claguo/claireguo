import React from "react";
import { useLocation } from "react-router-dom";
import { useProjectContext } from "../context/ProjectContext";

function ProjectHero() {
  const path = useLocation().pathname.split("/").filter(Boolean).pop();
  const project = useProjectContext().find((project) => project.path === path);

  if (!project) return null;

  return (
    <div className="flex flex-col pt-2xl gap-sm lg:gap-xl w-full">
      <div className="object-contain rounded-md overflow-hidden">
        <img
          src={`https://images.claireguo.com/${project.project}/cover.png`}
          alt={project.alt}
        />
      </div>
      <h1 className="text-md font-mono italic tracking-normal lg:text-lg lg:w-[928px] lg:px-lg lg:self-center">
        {project.title}
      </h1>
    </div>
  );
}

export default ProjectHero;
