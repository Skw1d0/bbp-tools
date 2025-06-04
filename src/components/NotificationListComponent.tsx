import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import { Task } from "../stores/useTasksStore";

interface NotificationProps {
  mode: "preview" | "normal";
  task?: Task;
}

export default function NotificationListComponent(props: NotificationProps) {
  if (props.mode === "preview") {
    return (
      // TODO: GET ALL NOTIFICATIONS FROM PROJECTS AN SHOW HERE
      <Card>
        <CardHeader title="Benachtrichtigungen" />
        <CardContent>
          <p>Keine Benachrichtigungen gefunden.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box flexGrow={1}>
      <Card>
        <CardHeader title="Erinnerungen" />
        <CardContent>
          <List>
            {props.task?.notifications.length === 0 && (
              <div>Keine Erinnerungen in dieser Phase vorhanden.</div>
            )}
            {props.task?.notifications.map((notification) => (
              <ListItem key={notification.id} disablePadding>
                <ListItemButton
                  divider={true}
                  onClick={() =>
                    console.log(`Navigating to project ${notification.id}`)
                  }
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={`${notification.text}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="primary">
              Neue Erinnerung erstellen
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
}
