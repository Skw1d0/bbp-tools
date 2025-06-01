import { Dayjs } from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Dayjs;
  taskID: string;
}

export interface Project {
  id: string;
  regID: string;
  bbmnID: string;
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
  addProject: (taskID: string, project: Project) => void;
  deleteProject: (taskID: string, projectID: string) => Task;
  marksProjectAsCompleted: (
    taskID: string,
    projectID: string,
    value: boolean
  ) => Task;
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
      addProject: (id: string, newProject: Project) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              projects: [...task.projects, newProject],
            };
          }
          return task;
        });
        set({ tasks: newTasks });
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
    }),
    { name: "mybbr-tool-tasks-store", version: 1 }
  )
);

export default useTasksStore;
