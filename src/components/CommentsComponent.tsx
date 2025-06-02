import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import useTasksStore, { Comment, Project, Task } from "../stores/useTasksStore";
import dayjs from "dayjs";
import { useState } from "react";
import generateUniqueId from "generate-unique-id";
import { Delete } from "@mui/icons-material";

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

    // Neuen Kommentar-Stand setzen
    const updatedProject = updatedTask.projects.find(
      (p: Project) => p.id === props.project?.id
    );
    if (updatedProject) {
      setComments(updatedProject.comments);
      setComment(""); // Optional: Eingabefeld leeren
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

    // Neuen Kommentar-Stand setzen
    const updatedProject = updatedTask.projects.find(
      (p: Project) => p.id === props.project?.id
    );
    if (updatedProject) {
      setComments(updatedProject.comments);
      setComment(""); // Optional: Eingabefeld leeren
    }
  };

  return (
    <Stack direction="column" spacing={1}>
      <List sx={{ maxHeight: "calc(100vh-100px)", overflow: "auto" }}>
        {comments.map((comment) => (
          <ListItem key={comment.id} divider>
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline={true}
                  value={comment.label}
                  disabled
                />
                <Typography fontSize={10}>
                  {dayjs(comment.date).utc().format("DD.MM.YYYY HH:mm")}
                </Typography>
              </Stack>
              <Box>
                <Tooltip title="Kommentar löschen">
                  <IconButton onClick={() => handleDeleteComment(comment.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>
      <TextField
        variant="filled"
        multiline={true}
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
  );
}
