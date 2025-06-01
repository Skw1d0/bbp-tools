import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import useTasksStore, { Task } from "../stores/useTasksStore";
import { useState } from "react";
import AddProjectComponent from "./AddProjectComponent";
import ImportProjectComponent from "./ImportProjectComponent";
import { bst } from "../tools/betriebsstellen";

import dayjs from "dayjs";
import {
  CheckCircle,
  Delete,
  Edit,
  LocationOn,
  Map,
  Unpublished,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

interface ProjectListProps {
  task: Task;
}

type DrawerType = "add" | "import" | undefined;

const proxy =
  process.env.REACT_APP_PROXY === undefined ? "" : process.env.REACT_APP_PROXY;

const checkAPN = async (bstRL100: string): Promise<boolean> => {
  try {
    const result = await fetch(
      `${proxy}https://trassenfinder.de/apn/${bstRL100}`
    );
    return result.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const openOpenrailwaymaps = async (RL100Code: string, RL100Lang: string) => {
  const query = `
[out:json][timeout:25];
nwr["railway"]["ref:de:ds100"="${RL100Code}"];
nwr["railway"]["name"="${RL100Lang}"];
out center;
`;
  try {
    const request = await fetch(
      `${proxy}https://overpass-api.de/api/interpreter`,
      {
        method: "POST",
        body: query,
      }
    );
    const data = await request.json();
    const { lat, lon } = data.elements[0];

    if (lat && lon) {
      window.open(
        `https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=15`,
        "_blank"
      );
    } else {
      alert("Sry, es konnte keine Betriebsstelle gefunden werden.");
    }
  } catch (e) {
    console.error(e);
  }
};

export default function ProjectsComponent(props: ProjectListProps) {
  const { deleteProject, marksProjectAsCompleted } = useTasksStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const [task, setTask] = useState<Task>(props.task);
  const [open, setOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(undefined);

  const toggleDrawer = (newOpen: boolean, type?: DrawerType) => {
    setDrawerType(type);
    setOpen(newOpen);
  };
  return (
    <>
      <Box flexGrow={1}>
        <Card>
          <CardHeader title="Projekte" />
          <CardContent>
            <List
              sx={{
                maxHeight: { xs: 200, sm: "calc(100vh - 350px)" },
                overflow: "auto",
              }}
            >
              {task.projects.length === 0 && (
                <div>Keine Projekte in dieser Aufgabe vorhanden.</div>
              )}
              {task.projects.map((project) => (
                <ListItem key={project.id} divider>
                  <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                    <Box
                      width={5}
                      sx={{
                        backgroundColor: project.completed
                          ? theme.palette.success.main
                          : "",
                      }}
                    />
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      width={"100%"}
                    >
                      <Stack direction="column" spacing={1} width={"100%"}>
                        <Stack
                          direction="row"
                          spacing={1}
                          divider={<Divider orientation="vertical" flexItem />}
                        >
                          <Typography>
                            <Link href="#">Anmeldung-{project.regID}</Link>
                          </Typography>
                          {project.bbmnID && (
                            <Typography>
                              <Link href="#">BBMN-{project.regID}</Link>
                            </Typography>
                          )}
                        </Stack>
                        <Typography>{project.title}</Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          divider={<Divider orientation="vertical" flexItem />}
                        >
                          <Stack direction="row" spacing={1} minWidth={300}>
                            <Stack
                              direction="row"
                              spacing={1}
                              divider={
                                <Divider orientation="vertical" flexItem />
                              }
                            >
                              {project.startBst && (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Tooltip
                                    title={
                                      bst.filter(
                                        (b) => b.RL100Code === project.startBst
                                      )[0].RL100Lang
                                    }
                                  >
                                    <Typography fontWeight={300}>
                                      {project.startBst}
                                    </Typography>
                                  </Tooltip>
                                  <Tooltip title="APN Gleisplan laden">
                                    <IconButton
                                      onClick={async () => {
                                        if (
                                          !(await checkAPN(project.startBst))
                                        ) {
                                          return alert(
                                            "Es steht kein APN Gleisplan zur verfügung."
                                          );
                                        }
                                        window.open(
                                          `https://trassenfinder.de/apn/${project.startBst}`
                                        );
                                      }}
                                    >
                                      <Map />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="OpenRailwayMaps.org öffnen">
                                    <IconButton
                                      onClick={() =>
                                        openOpenrailwaymaps(
                                          project.startBst,
                                          bst.filter(
                                            (b) =>
                                              b.RL100Code === project.startBst
                                          )[0].RL100Lang
                                        )
                                      }
                                    >
                                      <LocationOn />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              )}
                              {project.endBst && (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Tooltip
                                    title={
                                      bst.filter(
                                        (b) => b.RL100Code === project.endBst
                                      )[0].RL100Lang
                                    }
                                  >
                                    <Typography fontWeight={300}>
                                      {project.endBst}
                                    </Typography>
                                  </Tooltip>
                                  <Tooltip title="APN Gleisplan laden">
                                    <IconButton
                                      onClick={async () => {
                                        if (
                                          !(await checkAPN(project.startBst))
                                        ) {
                                          return alert(
                                            "Es steht kein APN Gleisplan zur verfügung."
                                          );
                                        }
                                        window.open(
                                          `https://trassenfinder.de/apn/${project.endBst}`
                                        );
                                      }}
                                    >
                                      <Map />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="OpenRailwayMaps.org öffnen">
                                    <IconButton
                                      onClick={() =>
                                        openOpenrailwaymaps(
                                          project.endBst,
                                          bst.filter(
                                            (b) =>
                                              b.RL100Code === project.endBst
                                          )[0].RL100Lang
                                        )
                                      }
                                    >
                                      <LocationOn />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              )}
                            </Stack>
                          </Stack>

                          <Box
                            alignItems="center"
                            display="flex"
                            minWidth={110}
                          >
                            <Typography fontWeight={300}>
                              {project.endVzg
                                ? project.startVzg + " - " + project.endVzg
                                : project.startVzg}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <Typography fontWeight={300}>
                              {dayjs(project.startDate)
                                .utc()
                                .format("DD.MM.YYYY HH:mm") +
                                " - " +
                                dayjs(project.endDate)
                                  .utc()
                                  .format("DD.MM.YYYY HH:mm")}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>

                      <Box width={120}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Als erledigt markieren">
                            <IconButton
                              onClick={() =>
                                setTask(
                                  marksProjectAsCompleted(
                                    task.id,
                                    project.id,
                                    !project.completed
                                  )
                                )
                              }
                            >
                              {project.completed ? (
                                <Unpublished />
                              ) : (
                                <CheckCircle />
                              )}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Projekt bearbeiten">
                            <IconButton
                              onClick={() => navigate(`/project/${project.id}`)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Projekt löschen">
                            <IconButton
                              onClick={() =>
                                setTask(deleteProject(task.id, project.id))
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Stack>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => toggleDrawer(true, "add")}
              >
                Projekt zuweisen
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => toggleDrawer(true, "import")}
              >
                Importieren
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Box>
      <Drawer open={open}>
        <Box sx={{ width: { xs: "100vw", sm: 600 } }} role="presentation">
          {drawerType === "add" && (
            <>
              <CardHeader
                title="Projekt zuweisen"
                subheader="Weise ein neues Projete der Aufgabe zu."
              />
              <Box padding={2}>
                <AddProjectComponent
                  cancleFunction={() => toggleDrawer(false)}
                  task={task}
                />
              </Box>
            </>
          )}
          {drawerType === "import" && (
            <>
              <CardHeader
                title="Projekt importieren"
                subheader="Importiere Projekte von BBPneo"
              />
              <Box padding={2}>
                <ImportProjectComponent
                  task={task}
                  cancleFunction={() => toggleDrawer(false)}
                  setTaskFunction={setTask}
                />
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
