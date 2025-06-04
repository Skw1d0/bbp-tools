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
} from "@mui/material";
import useTasksStore, { Comment, Project, Task } from "../stores/useTasksStore";
import { useState } from "react";
import generateUniqueId from "generate-unique-id";
import { Delete } from "@mui/icons-material";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/de";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("de");
dayjs().locale("de").format();

interface CommentsProps {
  task: Task;
  project: Project | undefined;
  cancleFunction: () => void;
  setTaskFunction: (task: Task) => void;
}

export default function CommentsComponent(props: CommentsProps) {
  const { addComment, deleteComment } = useTasksStore();
  const [comments, setComments] = useState<Comment[]>(
    props.project ? props.project.comments : []
  );
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (!props.project) return;
    if (comment === "") return;

    const updatedTask = addComment(props.task.id, props.project?.id, {
      id: generateUniqueId({ length: 8 }),
      label: comment,
      date: dayjs().utc().toISOString(),
    });
    props.setTaskFunction(updatedTask);

    const updatedProject = updatedTask.projects.find(
      (p: Project) => p.id === props.project?.id
    );
    if (updatedProject) {
      setComments(updatedProject.comments);
      setComment("");
    }
  };

  const handleDeleteComment = (commentID: string) => {
    if (!props.project) return;
    const updatedTask = deleteComment(
      props.task.id,
      props.project?.id,
      commentID
    );
    props.setTaskFunction(updatedTask);

    const updatedProject = updatedTask.projects.find(
      (p: Project) => p.id === props.project?.id
    );
    if (updatedProject) {
      setComments(updatedProject.comments);
      setComment("");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Stack direction="column" spacing={1} padding={2}>
        <Card variant="outlined">
          <CardHeader title="Kommentare" />
          <CardContent>
            <List sx={{ maxHeight: "calc(100vh-100px)", overflow: "auto" }}>
              {comments.length === 0 && (
                <Typography>Keine Kommentare vorhanden.</Typography>
              )}
              {comments.map((comment) => (
                <ListItem key={comment.id}>
                  <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{ width: "100%" }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={comment.label}
                        disabled
                      />
                      <DateTimeField
                        size="small"
                        value={dayjs(comment.date)}
                        disabled
                      />
                    </Stack>
                    <Box>
                      <Tooltip title="Kommentar löschen">
                        <IconButton
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Neuen Kommentar erstellen" />
          <CardContent>
            <Stack direction="column" spacing={1}>
              <TextField
                multiline
                rows={4}
                label="Kommentar"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddComment()}
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
