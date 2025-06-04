import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CardHeader, IconButton, Stack, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import useTasksStore, { Task } from "../stores/useTasksStore";
import AppbarComponent from "../components/AppbarComponent";
import ProjectListComponent from "../components/ProjectListComponent";
// import AppointmentsComponent from "../components/AppointmentsComponent";

export default function TaskDashboard() {
  const { deleteTask } = useTasksStore();
  const navigate = useNavigate();

  const appbarLinks = [{ label: "Aufgaben", path: "/tasks" }];
  const params = useParams();
  const { getTask } = useTasksStore();
  const [task, setTask] = useState<Task | undefined>(undefined);

  const handleDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    navigate("/tasks");
  };

  useEffect(() => {
    if (params.id) {
      const taskData = getTask(params.id);
      if (taskData) {
        setTask(taskData);
      } else {
        console.error("Task not found");
      }
    } else {
      console.error("No task ID provided in params");
    }
  }, [params, getTask]);

  if (!task) return <p>Task ID not found.</p>;

  return (
    <div>
      <AppbarComponent links={appbarLinks} />
      <Stack direction="column" spacing={1} margin={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CardHeader title={task?.title} subheader={task?.description} />
          <Typography flexGrow={1} />
          {task && (
            <>
              <IconButton>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete()}>
                <Delete />
              </IconButton>
            </>
          )}
        </Stack>
        <ProjectListComponent task={task} />
        {/* <Grid container direction={{ sm: "column", md: "row" }} spacing={1}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProjectsComponent task={task} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <AppointmentsComponent mode="normal" />
          </Grid>
        </Grid> */}
      </Stack>
    </div>
  );
}
