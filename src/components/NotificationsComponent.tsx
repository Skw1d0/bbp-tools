import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import useTasksStore, {
  Notification,
  Project,
  Task,
} from "../stores/useTasksStore";
import {
  DateTimeField,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import { useState } from "react";
import generateUniqueId from "generate-unique-id";
import { CheckCircle, Delete, Unpublished } from "@mui/icons-material";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("de");
dayjs().locale("de").format();

interface NotificationsProps {
  task: Task;
  project: Project | undefined;
  cancleFunction: () => void;
  setTaskFunction: (task: Task) => void;
}

export default function NotificationsComponent(props: NotificationsProps) {
  const { addNotification, deleteNotification, markNotificationAsCompleted } =
    useTasksStore();
  const theme = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>(
    props.project ? props.project.notifications : []
  );
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);

  const handleSaveNotification = () => {
    if (!props.project) return;

    const updatedTask = addNotification(props.task.id, props.project.id, {
      id: generateUniqueId({ length: 8 }),
      title: title,
      text: text,
      completed: false,
      date: dayjs(date).utc().toISOString(),
    });

    props.setTaskFunction(updatedTask);

    const updatedProject = updatedTask.projects.find(
      (p: Project) => p.id === props.project?.id
    );
    if (updatedProject) {
      setNotifications(updatedProject.notifications);
      setTitle("");
      setText("");
      setDate(null);
    }
  };

  const handleDeleteNotification = (notificationID: string) => {
    if (!props.project) return;

    const updatedTask = deleteNotification(
      props.task.id,
      props.project.id,
      notificationID
    );

    props.setTaskFunction(updatedTask);

    const updatedProject = updatedTask.projects.find(
      (p: Project) => p.id === props.project?.id
    );
    if (updatedProject) {
      setNotifications(updatedProject.notifications);
      setTitle("");
      setText("");
      setDate(null);
    }
  };

  const handleMarkNotificationAsCompleted = (
    notificationID: string,
    completed: boolean
  ) => {
    if (!props.project) return;
    const updatedTask = markNotificationAsCompleted(
      props.task.id,
      props.project.id,
      notificationID,
      completed
    );
    props.setTaskFunction(updatedTask);

    const updatedProject = updatedTask.projects.find(
      (p: Project) => p.id === props.project?.id
    );
    if (updatedProject) {
      setNotifications(updatedProject.notifications);
    }
  };

  const sortNotificationsByDate = (
    notifications: Notification[]
  ): Notification[] => {
    return [...notifications].sort((a, b) => {
      return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Stack direction="column" spacing={1} padding={2}>
        <Card variant="outlined">
          <CardHeader title="Benachrichtigungen" />
          <CardContent>
            {notifications.length === 0 && (
              <Typography>Keine Benachrichtungen verhanden.</Typography>
            )}
            <List disablePadding>
              {sortNotificationsByDate(notifications).map((notification) => (
                <ListItem key={notification.id}>
                  <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                    <Box
                      width={5}
                      borderRadius={2}
                      sx={{
                        backgroundColor: notification.completed
                          ? theme.palette.success.main
                          : "",
                      }}
                    />
                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{ width: "100%" }}
                    >
                      <TextField
                        size="small"
                        value={notification.title}
                        disabled
                      />
                      <TextField
                        size="small"
                        value={notification.text}
                        multiline
                        rows={4}
                        disabled
                      />
                      <DateTimeField
                        size="small"
                        value={dayjs(notification.date)}
                        disabled
                      />
                    </Stack>
                    <Box>
                      <Stack direction="column">
                        <Tooltip title="Als erledigt markieren">
                          <IconButton
                            onClick={() =>
                              handleMarkNotificationAsCompleted(
                                notification.id,
                                !notification.completed
                              )
                            }
                          >
                            {notification.completed ? (
                              <Unpublished />
                            ) : (
                              <CheckCircle />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Benachrichtigung löschen">
                          <IconButton
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardHeader title="Neue Benachrichtigung" />
          <CardContent>
            <Stack direction="column" spacing={1}>
              <Stack direction="column" spacing={1}>
                <TextField
                  label="Titel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  label="Text"
                  multiline
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <DateTimePicker
                  label="Termin"
                  value={date}
                  onChange={(e) => setDate(e)}
                />
              </Stack>
              <Button
                variant="contained"
                color="primary"
                disabled={!title || date === null ? true : false}
                onClick={() => handleSaveNotification()}
              >
                Speichern
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={props.cancleFunction}
              >
                Abbrechen
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </LocalizationProvider>
  );
}
