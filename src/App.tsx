import React from "react";
import {
  Turtle,
  Rabbit,
  Plus,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Github,
  Archive,
  ChevronUpCircle,
  ChevronDownCircle,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  progress: number;
  notes: string;
  collapsed: boolean;
  archived: boolean;
}

function App() {
  const [projects, setProjects] = React.useState<Project[]>(() => {
    const saved = localStorage.getItem("burgerBoi");
    if (!saved) return [];
    return JSON.parse(saved);
  });
  const [newProject, setNewProject] = React.useState("");
  const [showArchived, setShowArchived] = React.useState(false);

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem("burgerBoi", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const collapseAll = () => {
    const updated = projects.map(p => ({ ...p, collapsed: true }));
    saveProjects(updated);
  };

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.trim()) return;

    const project: Project = {
      id: crypto.randomUUID(),
      name: newProject.trim(),
      progress: 0,
      notes: "",
      collapsed: false,
      archived: false,
    };

    saveProjects([project, ...projects]);
    setNewProject("");
  };

  const updateNotes = (id: string, notes: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, notes };
      }
      return p;
    });
    saveProjects(updated);
  };

  const updateProgress = (id: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, progress: Math.min(p.progress + 20, 100) };
      }
      return p;
    });
    saveProjects(updated);
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  const resetAllProgress = () => {
    const updated = projects.map((p) => ({ ...p, progress: 0 }));
    saveProjects(updated);
  };

  const resetProgress = (id: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, progress: 0 };
      }
      return p;
    });
    saveProjects(updated);
  };

  const toggleCollapse = (id: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, collapsed: !p.collapsed };
      }
      return p;
    });
    saveProjects(updated);
  };

  const moveDown = (id: string) => {
    const currentIndex = projects.findIndex((p) => p.id === id);
    if (currentIndex === -1 || currentIndex === projects.length - 1) return;

    const newProjects = [...projects];
    [newProjects[currentIndex], newProjects[currentIndex + 1]] = [
      newProjects[currentIndex + 1],
      newProjects[currentIndex],
    ];

    saveProjects(newProjects);
  };

  const moveUp = (id: string) => {
    const currentIndex = projects.findIndex((p) => p.id === id);
    if (currentIndex === -1 || currentIndex === 0) return;

    const newProjects = [...projects];
    [newProjects[currentIndex], newProjects[currentIndex - 1]] = [
      newProjects[currentIndex - 1],
      newProjects[currentIndex],
    ];

    saveProjects(newProjects);
  };

  const archiveProject = (id: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, archived: true, progress: 0 };
      }
      return p;
    });
    saveProjects(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-2xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-2">
            🍔 Burger Boi
          </h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-amber-700">
              Track your project progress, one bite at a time!
            </p>
            <a
              href="https://github.com/alexpineda/burgerboi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 transition-colors"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </header>

        <form onSubmit={addProject} className="mb-8 flex gap-2">
          <input
            type="text"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder="Enter project name..."
            className="flex-1 px-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Add Project
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-lg ">
          {projects.filter((p) => !p.archived).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No projects yet. Add your first project above!
            </div>
          ) : (
            <div className="space-y-8">
              <div className="divide-y divide-amber-100">
                {projects
                  .filter((p) => !p.archived)
                  .map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 hover:bg-amber-50 transition-colors"
                    >
                      <div 
                        className="flex-1 min-w-0 cursor-pointer" 
                        onClick={(e) => {
                          if (!(e.target as HTMLElement).closest('button')) {
                            toggleCollapse(project.id);
                          }
                        }}
                        onDoubleClick={(e) => {
                          if (!(e.target as HTMLElement).closest('button')) {
                            collapseAll();
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCollapse(project.id)}
                            className="p-1 hover:bg-amber-100 rounded transition-colors"
                          >
                            {project.collapsed ? (
                              <ChevronRight
                                size={20}
                                className="text-amber-700"
                              />
                            ) : (
                              <ChevronDown
                                size={20}
                                className="text-amber-700"
                              />
                            )}
                          </button>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {project.name}
                            </h3>
                            {project.collapsed && (
                              <span className="flex items-center gap-1 text-amber-600">
                                {[
                                  ...Array(Math.ceil(project.progress / 33.34)),
                                ].map((_, i) => (
                                  <span key={i}>
                                    {project.progress <= 50 ? (
                                      <Turtle size={14} />
                                    ) : (
                                      <Rabbit size={14} />
                                    )}
                                  </span>
                                ))}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={`w-full transition-all duration-300 ${
                            project.collapsed
                              ? "h-0 opacity-0 overflow-hidden"
                              : "h-auto opacity-100 mt-2"
                          }`}
                        >
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <textarea
                            value={project.notes}
                            onChange={(e) =>
                              updateNotes(project.id, e.target.value)
                            }
                            placeholder="Add notes here..."
                            className="w-full mt-2 text-sm text-gray-600 bg-transparent resize-none focus:outline-none"
                            rows={1}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = "auto";
                              target.style.height = target.scrollHeight + "px";
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        {project.collapsed ? (
                          <>
                            {index !== 0 && (
                              <button
                                onClick={() => moveUp(project.id)}
                                className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                                title="Move up"
                              >
                                <ChevronUpCircle size={20} className="text-amber-700" />
                              </button>
                            )}
                            {index !== projects.filter(p => !p.archived).length - 1 && (
                              <button
                                onClick={() => moveDown(project.id)}
                                className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                                title="Move down"
                              >
                                <ChevronDownCircle
                                  size={20}
                                  className="text-amber-700"
                                />
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => updateProgress(project.id)}
                              className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Click to progress"
                            >
                              {project.progress < 50 ? (
                                <Turtle size={24} className="text-amber-700" />
                              ) : (
                                <Rabbit size={24} className="text-amber-700" />
                              )}
                            </button>

                            <button
                              onClick={() => resetProgress(project.id)}
                              className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Reset progress"
                            >
                              <RotateCcw size={20} className="text-amber-700" />
                            </button>
                            <button
                              onClick={() => archiveProject(project.id)}
                              className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Archive project"
                            >
                              <Archive size={20} className="text-amber-700" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-6 flex justify-end gap-4">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2"
        >
          <Archive size={20} className="text-amber-700" />
          {showArchived ? "Hide Archived" : "Show Archived"}
        </button>
        <button
          onClick={resetAllProgress}
          className="text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2"
        >
          <RotateCcw size={20} className="text-amber-700" />
          Reset All Progress
        </button>
      </div>

      {showArchived && (
        <div className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">
            Archived Projects
          </h2>
          <div className="bg-white rounded-xl shadow-lg">
            {projects.filter((p) => p.archived).length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No archived projects
              </div>
            ) : (
              <div className="divide-y divide-amber-100">
                {projects
                  .filter((p) => p.archived)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {project.name}
                        </h3>
                        {project.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {project.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const updated = projects.map((p) => {
                              if (p.id === project.id) {
                                return { ...p, archived: false };
                              }
                              return p;
                            });
                            if (updated.filter(p => p.archived).length === 0) {
                              setShowArchived(false);
                            }
                            saveProjects(updated);
                          }}
                          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Unarchive project"
                        >
                          <Archive size={20} className="text-amber-700" />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete project"
                        >
                          <Trash2 size={20} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
