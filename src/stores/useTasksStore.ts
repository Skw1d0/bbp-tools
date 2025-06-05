import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  title: string;
  text: string;
  date: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  label: string;
  date: string;
}

export interface Project {
  id: string;
  regID: string;
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
  notifications: Notification[];
  comments: Comment[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  projects: Project[];
  notifications: Notification[];
}

export interface TasksStoreState {
  tasks: Task[];
}

export interface TasksStateActions {
  addTask: (task: Task) => void;
  getTask: (taskID: string) => Task | undefined;
  getAllTasks: () => Task[];
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
  addNotification: (
    taskID: string,
    projectID: string,
    newNotification: Notification
  ) => Task;
  markNotificationAsCompleted: (
    taskID: string,
    projectID: string,
    appointmentID: string,
    value: boolean
  ) => Task;
  deleteNotification: (
    taskID: string,
    projectID: string,
    appointmentID: string
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
      getAllTasks: (): Task[] => {
        return get().tasks;
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
      addNotification: (
        taskID: string,
        projectID: string,
        newNotification: Notification
      ): Task => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.map((project) => {
              if (project.id !== projectID) return project;
              return {
                ...project,
                notifications: [...project.notifications, newNotification],
              };
            }),
          };
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
      markNotificationAsCompleted: (
        taskID: string,
        projectID: string,
        notificationID: string,
        value: boolean
      ): Task => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.map((project) => {
              if (project.id !== projectID) return project;
              return {
                ...project,
                notifications: project.notifications.map((appointment) =>
                  appointment.id === notificationID
                    ? { ...appointment, completed: value }
                    : appointment
                ),
              };
            }),
          };
        });
        set({ tasks: newTasks });
        return newTasks.filter((task) => task.id === taskID)[0];
      },
      deleteNotification: (
        taskID: string,
        projectID: string,
        notificationID: string
      ): Task => {
        const newTasks = get().tasks.map((task) => {
          if (task.id !== taskID) return task;
          return {
            ...task,
            projects: task.projects.map((project) => {
              if (project.id !== projectID) return project;
              return {
                ...project,
                notifications: project.notifications.filter(
                  (appointment) => appointment.id !== notificationID
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
      name: "bbp-tools-tasks-store",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // // Füge comments: [] zu jedem Project hinzu, falls nicht vorhanden
        // if (persistedState?.tasks) {
        //   persistedState.tasks = persistedState.tasks.map((task: any) => ({
        //     ...task,
        //     projects: task.projects.map((project: any) => ({
        //       ...project,
        //       comments: project.comments ?? [],
        //     })),
        //   }));
        // }
        // return persistedState;
      },
    }
  )
);

export default useTasksStore;
