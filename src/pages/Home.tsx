import { Stack } from "@mui/material";
import AppbarComponent from "../components/AppbarComponent";
import TasksComponent from "../components/TasksComponent";
import NotificationListComponent from "../components/NotificationListComponent";

export default function Home() {
  return (
    <div>
      <AppbarComponent />
      <Stack direction="column" spacing={1} margin={1}>
        <NotificationListComponent />
        <TasksComponent mode="normal" />
      </Stack>
    </div>
  );
}
