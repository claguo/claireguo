import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowForward } from "react-icons/io";
import Tag from "../general/Tag";

function ProjectCard({ project, size, className }) {
  const [isHovered, setIsHovered] = useState(false);
  const src = `https://images.claireguo.com/${project.project}-cover.png`;

  return (
    <>
      {size === "sm" ? (
        <Link
          to={project.protected ? "/2026/login" : `/2026/${project.path}`}
          state={project.protected ? { from: `/2026/${project.path}` } : null}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className={`flex flex-col lg:items-center gap-2xs lg:gap-xs lg:flex-1 shrink-0 w-[240px] font-mono tracking-normal ${
            isHovered ? "text-pink" : "italic"
          } ${className}`}
        >
          <div className="flex overflow-hidden rounded-sm object-cover w-full">
            <img
              src={src}
              alt={project.alt}
              className={`duration-500 ${isHovered ? "scale-[1.025]" : ""}`}
            />
          </div>
          <div className="flex w-full justify-between gap-2xs">
            <span className="w-full">{project.title}</span>
            <IoMdArrowForward className="text-[16px] block" />
          </div>
        </Link>
      ) : (
        <Link
          to={project.protected ? "/2026/login" : `/2026/${project.path}`}
          state={project.protected ? { from: `/2026/${project.path}` } : null}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className="flex flex-col gap-xs lg:gap-sm lg:w-[calc(50%-4px)]"
        >
          <div className="flex justify-between items-center overflow-hidden rounded-sm">
            <img
              src={src}
              alt={project.alt}
              className={`duration-500 ${isHovered ? "scale-[1.015]" : ""}`}
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-3xs lg:gap-xl px-4xs w-full">
            <h3 className="lg:w-1/3 lg:text-[16px]">{project.title}</h3>

            <div className="flex flex-col gap-2xs">
              <p className="text-sm font-sans">{project.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-3xs">
                  {project.tags.map((tag, index) => (
                    <Tag key={index} text={tag}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                <IoMdArrowForward className="text-[16px] lg:hidden" />
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export default ProjectCard;
