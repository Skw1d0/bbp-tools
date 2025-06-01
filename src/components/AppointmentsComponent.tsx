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

interface AppointmentProps {
  mode: "preview" | "normal";
  task?: Task;
}

export default function AppointmentsComponent(props: AppointmentProps) {
  if (props.mode === "preview") {
    return (
      // TODO: GET ALL APPOINTMENTS FROM PROJECTS AN SHOW HERE
      <Card>
        <CardHeader title="Erinnerungen" />
        <CardContent>
          <p>Keine Erinnerungen gefunden.</p>
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
            {props.task?.appointments.length === 0 && (
              <div>Keine Erinnerungen in dieser Phase vorhanden.</div>
            )}
            {props.task?.appointments.map((appointment) => (
              <ListItem key={appointment.id} disablePadding>
                <ListItemButton
                  divider={true}
                  onClick={() =>
                    console.log(`Navigating to project ${appointment.taskID}`)
                  }
                >
                  <ListItemText
                    primary={appointment.title}
                    secondary={`${appointment.description}`}
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
