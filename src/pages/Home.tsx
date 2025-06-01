import { Stack } from "@mui/material";
import AppbarComponent from "../components/AppbarComponent";
import TasksComponent from "../components/TasksComponent";
import AppointmentsComponent from "../components/AppointmentsComponent";

export default function Home() {
  const appbarLinks = [
    { label: "Aufgaben", path: "/tasks" },
    { label: "Erinnerungen", path: "/appointments" },
  ];

  return (
    <div>
      <AppbarComponent links={appbarLinks} />
      <Stack direction="column" spacing={1} margin={1}>
        <AppointmentsComponent mode="preview" />
        <TasksComponent mode="preview" />
      </Stack>
    </div>
  );
}
