import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowForward } from "react-icons/io";
import { useProjectContext } from "../context/ProjectContext";

// index of every project that lives under /archive/*
function ArchivePage() {
  const projects = useProjectContext().filter((project) =>
    project.route?.startsWith("/archive/"),
  );

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <section className="px-xs lg:px-[20px] flex flex-col pt-3xl pb-lg w-screen lg:max-w-[928px] lg:mx-auto">
      <h1 className="text-md font-mono tracking-normal lg:text-lg pb-xl">
        Archive
      </h1>
      <ul className="flex flex-col border-t border-[#C0C0D8]">
        {projects.map((project) => (
          <li key={project.path} className="border-b border-[#C0C0D8]">
            <Link
              to={project.route}
              className="group flex flex-col lg:flex-row gap-3xs lg:gap-xl py-sm hover:text-pink"
            >
              <span className="font-mono tracking-normal text-sm text-text-subtle lg:w-[120px] shrink-0">
                {project.tags[0]}
              </span>
              <div className="flex flex-col gap-4xs flex-1">
                <span className="flex items-center justify-between gap-xs font-mono tracking-normal">
                  {project.title}
                  <IoMdArrowForward className="text-[16px] shrink-0" />
                </span>
                <p className="text-sm text-text-default group-hover:text-text-default">
                  {project.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ArchivePage;
