import { Project } from "@/lib/db";
import FileIcon from "./FileIcon";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";
import Animation from "@/lottifiles/empty.json";
import { Button } from "../ui/button";

const ProjectList = ({
  onDuplicateProject,
  onDeleteProject,
  projects,
}: {
  onDuplicateProject?: Function;
  onDeleteProject?: Function;
  projects: Project[];
}) => {
  const router = useRouter();

  const onOpenProject = (project: Project) => {
    router.push("/editor/?projectId=" + project.id);
  };
  console.log("projects", projects);

  return (
    <div className=" h-[480px] overflow-y-auto">
      <div className=" space-y-0 mt-2 ">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <button
              onClick={() => onOpenProject(project)}
              key={index}
              className="p-3 text-gray-400   bg-opacity-20 cursor-pointer flex  gap-3 flex-col border-b border-opacity-20 border-white hover:bg-gray-100 hover:bg-opacity-20 w-full"
            >
              <div className="flex gap-3">
                <FileIcon extenstion={"html"} size="large" />
                <h2>{project.name}</h2>
              </div>
              <span className="self-end text-[11px] text-stone-500 ">
                Last accessed: {project.modifiedAt.toDateString()}
              </span>
            </button>
          ))
        ) : (
          <div className=" flex flex-col">
            <Lottie
              className=" h-80 opacity-60"
              loop
              animationData={Animation}
              play
            />
            <span className="text-lg text-center text-red-400 font-bold font-mono  ">
              You have not started a project
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
