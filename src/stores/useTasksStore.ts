import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  taskID: string;
}

export interface Comment {
  id: string;
  label: string;
  date: string;
}

export interface Project {
  id: string;
  regID: string;
  // bbmnID: string;
  status: string;
  category: string;
  title: string;
  startVzg: string;
  endVzg: string;
  startBst: string;
  endBst: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  appointments: Appointment[];
  comments: Comment[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  projects: Project[];
  appointments: Appointment[];
}

export interface TasksStoreState {
  tasks: Task[];
}

export interface TasksStateActions {
  addTask: (task: Task) => void;
  getTask: (taskID: string) => Task | undefined;
  deleteTask: (taskID: string) => void;
  addProject: (taskID: string, project: Project) => Task;
  editProject: (
    taskID: string,
    oldProject: Project,
    newProject: Project
  ) => Task;
  deleteProject: (taskID: string, projectID: string) => Task;
  marksProjectAsCompleted: (
    taskID: string,
    projectID: string,
    value: boolean
  ) => Task;
  addComment: (taskID: string, projectID: string, newComment: Comment) => Task;
  deleteComment: (taskID: string, projectID: string, commentID: string) => Task;
}

const initialPhases: TasksStoreState = {
  tasks: [],
};

const useTasksStore = create<TasksStoreState & TasksStateActions>()(
  persist(
    (set, get) => ({
      ...initialPhases,
      addTask: (phase: Task) => {
        const currentTasks = get().tasks;
        set({ tasks: [...currentTasks, phase] });
      },
      getTask: (id: string) => {
        return get().tasks.find((task) => task.id === id);
      },
      deleteTask: (id: string) => {
        set({ tasks: [...get().tasks.filter((task) => task.id !== id)] });
      },
      addProject: (taskID: string, newProject: Project) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskID) {
            return {
              ...task,
              projects: [...task.projects, newProject],
            };
          }
          return task;
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
      editProject: (
        taskID: string,
        oldProject: Project,
        newProject: Project
      ) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.map((project) => {
              if (project.id !== oldProject.id) return project;
              return {
                ...project,
                regID: newProject.regID,
                // bbmnID: newProject.bbmnID,
                status: newProject.status,
                category: newProject.category,
                title: newProject.title,
                startVzg: newProject.startVzg,
                endVzg: newProject.endVzg,
                startBst: newProject.startBst,
                endBst: newProject.endBst,
                startDate: newProject.startDate,
                endDate: newProject.endDate,
              };
            }),
          };
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
      deleteProject: (taskID: string, projectID: string) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.filter(
              (project) => project.id !== projectID
            ),
          };
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
      marksProjectAsCompleted: (
        taskID: string,
        projectID: string,
        value: boolean
      ) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.map((project) =>
              project.id === projectID
                ? { ...project, completed: value }
                : project
            ),
          };
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
      addComment: (
        taskID: string,
        projectID: string,
        newComment: Comment
      ): Task => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.map((project) => {
              if (project.id !== projectID) return project;
              return {
                ...project,
                comments: [...project.comments, newComment],
              };
            }),
          };
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
      deleteComment: (
        taskID: string,
        projectID: string,
        commentID: string
      ): Task => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.map((project) => {
              if (project.id !== projectID) return project;
              return {
                ...project,
                comments: project.comments.filter(
                  (comment) => comment.id !== commentID
                ),
              };
            }),
          };
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
    }),
    {
      name: "mybbr-tool-tasks-store",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Füge comments: [] zu jedem Project hinzu, falls nicht vorhanden
        if (persistedState?.tasks) {
          persistedState.tasks = persistedState.tasks.map((task: any) => ({
            ...task,
            projects: task.projects.map((project: any) => ({
              ...project,
              comments: project.comments ?? [],
            })),
          }));
        }
        return persistedState;
      },
    }
  )
);

export default useTasksStore;
