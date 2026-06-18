import React from "react";
import { useLocation } from "react-router-dom";
import { useProjectContext } from "../context/ProjectContext";

function ProjectSummary() {
  const path = useLocation().pathname.split("/").filter(Boolean).pop();
  const project = useProjectContext().find((project) => project.path === path);

  if (!project) return null;

  return (
    <div className="flex gap-xs lg:text-sm lg:text-sm lg:justify-between lg:gap-md text-sm">
      <div className="flex flex-col gap-3xs lg:gap-2xs flex-1">
        <span className="font-mono italic tracking-normal text-text-subtle text-sm">
          {" "}
          What?{" "}
        </span>
        <p className="text-text-default">{project.tags.slice(1).join(", ")}</p>
      </div>

      <div className="flex flex-col gap-3xs lg:gap-2xs flex-1">
        <span className="font-mono italic tracking-normal text-text-subtle text-sm">
          {" "}
          Who?{" "}
        </span>
        <p> {project.team} </p>
      </div>

      <div className="flex flex-col gap-3xs lg:gap-2xs flex-1">
        <span className="font-mono italic tracking-normal text-text-subtle text-sm">
          {" "}
          When?{" "}
        </span>
        <p> {project.duration} </p>
      </div>
    </div>
  );
}

export default ProjectSummary;
