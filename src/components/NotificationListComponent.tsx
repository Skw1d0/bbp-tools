import {
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import useTasksStore, { Project, Task } from "../stores/useTasksStore";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

interface NotificationProps {
  // mode: "preview" | "normal";
  task?: Task;
}

export default function NotificationListComponent(props: NotificationProps) {
  const { getAllTasks } = useTasksStore();
  const navigate = useNavigate();

  // eslint-disable-next-line
  const [projects, setProjects] = useState<Project[]>(
    getAllTasks().flatMap((task) => [...task.projects])
  );

  // if (props.mode === "preview") {
  //   return (
  //     // TODO: GET ALL NOTIFICATIONS FROM PROJECTS AN SHOW HERE
  //     <Card>
  //       <CardHeader title="Erinnerungen" />
  //       <CardContent>
  //         <p>Keine Erinnerung gefunden.</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Box flexGrow={1}>
      <Card>
        <CardContent>
          <List>
            {projects
              .filter((project) => project.notifications.length > 0)
              .flatMap((project) =>
                project.notifications.map((notification) => (
                  <ListItemButton
                    key={notification.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <Stack direction="row" spacing={1} width="100%">
                      <ListItemText
                        primary={project.title}
                        secondary={`Anmeldung-${project.regID}`}
                      />
                      <ListItemText
                        primary={notification.title}
                        secondary={dayjs(notification.date).format(
                          "DD.MM.YYYY HH:mm"
                        )}
                      />
                    </Stack>
                  </ListItemButton>
                ))
              )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
