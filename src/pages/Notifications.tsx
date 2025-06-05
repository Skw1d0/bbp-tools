import { Stack } from "@mui/material";
import AppbarComponent from "../components/AppbarComponent";
import NotificationListComponent from "../components/NotificationListComponent";

export default function Notifications() {
  return (
    <div>
      <AppbarComponent />
      <Stack direction="column" spacing={1} margin={1}>
        <NotificationListComponent />
      </Stack>
    </div>
  );
}
