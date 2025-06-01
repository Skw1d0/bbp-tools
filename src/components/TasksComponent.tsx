import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useTasksStore from "../stores/useTasksStore";
import { useNavigate } from "react-router";
import { useState } from "react";
import generateUniqueId from "generate-unique-id";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export interface TasksListProps {
  mode: "preview" | "normal";
}

export default function TasksComponent(props: TasksListProps) {
  const { tasks: phases } = useTasksStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { addTask: addPhase } = useTasksStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if (!name) {
      alert("Bitte fülle den Namen der Aufgabe aus.");
      return;
    }

    const newId = generateUniqueId({ length: 8 });
    addPhase({
      id: newId,
      title: name.trim(),
      description: description.trim(),
      createdAt: dayjs.utc().toISOString(),
      projects: [],
      appointments: [],
    });
    navigate(`/tasks/${newId}`);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Card>
        {props.mode === "preview" && <CardHeader title="Aufgaben" />}
        <CardContent>
          {phases.length === 0 && (
            <Typography>Keine Aufgaben vorhanden.</Typography>
          )}
          <List>
            {phases.map((phase, index) => (
              <ListItem key={phase.id} disablePadding>
                <ListItemButton
                  divider={index < phases.length - 1 ? true : false}
                  onClick={() => navigate(`/tasks/${phase.id}`)}
                >
                  <ListItemText
                    primary={phase.title}
                    secondary={phase.description}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
        {props.mode === "normal" && (
          <CardActions>
            <Stack direction="row" spacing={1}>
              <Button
                color="primary"
                variant="outlined"
                onClick={toggleDrawer(true)}
              >
                Neue Aufgabe erstellen
              </Button>
            </Stack>
          </CardActions>
        )}
      </Card>
      <Drawer open={open}>
        <Box sx={{ width: { xs: "100vw", sm: 600 } }} role="presentation">
          <CardHeader
            title="Neue Aufgabe erstellen"
            subheader="Erstelle eine neue Aufgabe, in der du Projekte oder Erinnerungen speichern kannst."
          />
          <Stack direction="column" spacing={1} padding={2}>
            <TextField
              label="Name der Aufgabe"
              variant="filled"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Beschreibung der Aufgabe"
              variant="filled"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Speichern
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleDrawer(false)}
            >
              Abbrechen
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
