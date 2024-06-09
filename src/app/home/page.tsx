"use client";
import React, { useState } from "react";

function App() {
  const [projects, setProjects] = useState([
    {
      name: "Project Alpha",
      lastModified: "2023-06-09",
      language: "JavaScript",
      status: "Open",
    },
    {
      name: "Project Beta",
      lastModified: "2023-06-08",
      language: "Python",
      status: "Requires Attention",
    },
  ]);

  const handleCreateProject = (name: string) => {
    setProjects([
      ...projects,
      {
        name,
        lastModified: new Date().toISOString().split("T")[0],
        language: "JavaScript",
        status: "Open",
      },
    ]);
  };

  const handleOpenProject = (project: string) => {
    console.log("Open project:", project);
  };

  const handleDuplicateProject = (project: any) => {
    const newProject = {
      ...project,
      name: `${project.name} Copy`,
      lastModified: new Date().toISOString().split("T")[0],
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (project: any) => {
    setProjects(projects.filter((p) => p !== project));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Project Dashboard</h1>
      <SearchFilter />
      <ProjectActions onCreateProject={handleCreateProject} />
      <ProjectList
        projects={projects}
        onOpenProject={handleOpenProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
      />
      <CloudSync />
      <Collaboration />
    </div>
  );
}

export default App;

const ProjectActions = ({ onCreateProject }: any) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleCreateProject = () => {
    onCreateProject(newProjectName);
    setShowModal(false);
  };

  return (
    <div className="flex justify-between items-center py-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Create New Project
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <input
              type="text"
              className="border p-2 mb-4 w-full"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCreateProject}
            >
              Create
            </button>
            <button
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const projects = [
  {
    name: "Project Alpha",
    lastModified: "2023-06-09",
    language: "JavaScript",
    status: "Open",
  },
  {
    name: "Project Beta",
    lastModified: "2023-06-08",
    language: "Python",
    status: "Requires Attention",
  },
];

const ProjectList = ({
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
}: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm">
              Project Name
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">
              Last Modified
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">
              Language
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">
              Status
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {projects.map((project, index) => (
            <tr key={index}>
              <td className="py-3 px-4">{project.name}</td>
              <td className="py-3 px-4">{project.lastModified}</td>
              <td className="py-3 px-4">{project.language}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    project.status === "Open"
                      ? "bg-green-200 text-green-800"
                      : project.status === "Requires Attention"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  className="text-blue-500"
                  onClick={() => onOpenProject(project)}
                >
                  Open
                </button>
                <button
                  className="ml-2 text-blue-500"
                  onClick={() => onDuplicateProject(project)}
                >
                  Duplicate
                </button>
                <button
                  className="ml-2 text-red-500"
                  onClick={() => onDeleteProject(project)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CloudSync = () => {
  return (
    <div className="flex justify-between items-center py-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Connect to Cloud
      </button>
      <span className="text-gray-500">Cloud Sync: Not Connected</span>
    </div>
  );
};

const Collaboration = () => {
  return (
    <div className="py-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Invite Collaborators
      </button>
    </div>
  );
};

const SearchFilter = () => {
  return (
    <div className="flex justify-between items-center py-4">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Search projects..."
      />
      <select className="border p-2 ml-4">
        <option>Filter by Language</option>
        <option>JavaScript</option>
        <option>Python</option>
        <option>Java</option>
      </select>
      <select className="border p-2 ml-4">
        <option>Filter by Status</option>
        <option>Open</option>
        <option>Saved</option>
        <option>Requires Attention</option>
      </select>
    </div>
  );
};
