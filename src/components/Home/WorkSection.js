import React from "react";
import ProjectCard from "../custom/ProjectCard.js";
import { useProjectContext } from "../../context/ProjectContext.js";

function WorkSection() {
  const projects = useProjectContext().filter((p) => !p.archiveOnly);

  // const [filters, setFilters] = useState([
  //   "ui/ux design",
  //   "web development",
  //   "design strategy",
  //   "game development",
  //   "graphic design",
  //   "illustration",
  // ]);
  // const [filtered, setFiltered] = useState(projects);

  return (
    <>
      {/* <div className="lg:-mb-32 lg:mt-36 mt-16 flex flex-wrap items-center">
        <h2 className="mr-[1rem] my-0">work</h2>
        <CategoryButton
          text={"ui/ux design"}
          projects={projects}
          filtered={filtered}
          setFiltered={setFiltered}
          setFilters={setFilters}
          filters={filters}
        />
        <CategoryButton
          text={"web development"}
          projects={projects}
          filtered={filtered}
          setFiltered={setFiltered}
          setFilters={setFilters}
          filters={filters}
        />
        <CategoryButton
          text={"design strategy"}
          projects={projects}
          filtered={filtered}
          setFiltered={setFiltered}
          setFilters={setFilters}
          filters={filters}
        />
        <CategoryButton
          text={"game development"}
          projects={projects}
          filtered={filtered}
          setFiltered={setFiltered}
          setFilters={setFilters}
          filters={filters}
        />
        <CategoryButton
          text={"graphic design"}
          projects={projects}
          filtered={filtered}
          setFiltered={setFiltered}
          setFilters={setFilters}
          filters={filters}
        />
        <CategoryButton
          text={"illustration"}
          projects={projects}
          filtered={filtered}
          setFiltered={setFiltered}
          setFilters={setFilters}
          filters={filters}
        />
      </div> */}
      <div className="flex flex-wrap w-full px-xs lg:px-[20px] gap-xl lg:gap-x-3xs lg:gap-y-3xl">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}

export default WorkSection;
