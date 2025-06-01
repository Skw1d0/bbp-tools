import { Stack } from "@mui/material";
import AppbarComponent from "../components/AppbarComponent";
import TasksComponent from "../components/TasksComponent";

export default function TasksOverview() {
  const appbarLinks = [{ label: "Aufgaben", path: "/tasks" }];

  return (
    <div>
      <AppbarComponent links={appbarLinks} />
      <Stack direction="column" spacing={1} margin={1}>
        <TasksComponent mode="normal" />
      </Stack>
    </div>
  );
}
