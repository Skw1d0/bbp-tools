import {
  Badge,
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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import useTasksStore, { Project, Task } from "../stores/useTasksStore";
import { useState } from "react";
import AddProjectComponent from "./AddProjectComponent";
import ImportProjectComponent from "./ImportProjectComponent";
import { bst } from "../tools/betriebsstellen";

import dayjs from "dayjs";
import {
  CheckCircle,
  Comment,
  Delete,
  Edit,
  LocationOn,
  Map,
  MoreVert,
  NotificationsActive,
  Unpublished,
} from "@mui/icons-material";
import CommentsComponent from "./CommentsComponent";
import NotificationsComponent from "./NotificationsComponent";

interface ProjectListProps {
  task: Task;
}

type DrawerType =
  | "add_edit"
  | "import"
  | "comments"
  | "notifications"
  | undefined;

const openAPN = async (bstRL100: string) => {
  window.open(`https://trassenfinder.de/apn/${bstRL100}`, "_blank");
};

const openOpenrailwaymaps = async (RL100Code: string, RL100Lang: string) => {
  const query = `
[out:json][timeout:25];
nwr["railway"]["ref:de:ds100"="${RL100Code}"];
nwr["railway"]["name"="${RL100Lang}"];
out center;
`;
  try {
    const request = await fetch(`https://overpass-api.de/api/interpreter`, {
      method: "POST",
      body: query,
    });
    const data = await request.json();

    if (data.elements.length === 0) {
      alert("Es konnte keine Betriebsstelle gefunden werden.");
      return;
    }

    const { lat, lon } = data.elements[0];
    window.open(
      `https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=15`,
      "_blank"
    );
  } catch (e) {
    console.error(e);
  }
};

export default function ProjectListComponent(props: ProjectListProps) {
  const { deleteProject, marksProjectAsCompleted } = useTasksStore();
  const theme = useTheme();

  const [task, setTask] = useState<Task>(props.task);
  const [open, setOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(undefined);
  const [editProject, setEditProject] = useState<Project | undefined>(
    undefined
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    project: Project
  ) => {
    setEditProject(project);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen: boolean, type?: DrawerType) => {
    setEditProject(undefined);
    setDrawerType(type);
    setOpen(newOpen);
  };

  const showEditDrawer = (open: boolean, project: Project) => {
    setEditProject(project);
    setDrawerType("add_edit");
    setOpen(open);
  };

  const showCommentsDrawer = (open: boolean, project: Project) => {
    setEditProject(project);
    setDrawerType("comments");
    setOpen(open);
  };

  const showNotificationsDrawer = (open: boolean, project: Project) => {
    setEditProject(project);
    setDrawerType("notifications");
    setOpen(open);
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
                      borderRadius={2}
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
                            <Link
                              href={`https://bbpneo.deutschebahn.com/requests/edit/${project.regID}`}
                            >
                              Anmeldung-{project.regID}
                            </Link>
                          </Typography>
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
                                        openAPN(project.startBst);
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
                                        openAPN(project.endBst);
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

                      <Box width={180}>
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
                          <Tooltip title="Kommentare">
                            <Badge
                              badgeContent={project.comments.length}
                              color="info"
                            >
                              <IconButton
                                onClick={() =>
                                  showCommentsDrawer(true, project)
                                }
                              >
                                <Comment />
                              </IconButton>
                            </Badge>
                          </Tooltip>
                          <Tooltip title="Benachrichtigungen">
                            <Badge
                              badgeContent={
                                project.notifications.filter(
                                  (notification) => !notification.completed
                                ).length
                              }
                              color="primary"
                            >
                              <IconButton
                                onClick={() =>
                                  showNotificationsDrawer(true, project)
                                }
                              >
                                <NotificationsActive />
                              </IconButton>
                            </Badge>
                          </Tooltip>

                          <IconButton
                            onClick={(e) => handleOpenMenu(e, project)}
                          >
                            <MoreVert />
                          </IconButton>
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
                onClick={() => toggleDrawer(true, "add_edit")}
              >
                Neues Projekt
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
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            if (!editProject) return;
            handleCloseMenu();
            showEditDrawer(true, editProject);
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Bearbeiten</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!editProject) return;
            handleCloseMenu();
            setTask(deleteProject(props.task.id, editProject.id));
          }}
        >
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Löschen</ListItemText>
        </MenuItem>
      </Menu>
      <Drawer open={open}>
        <Box sx={{ width: { xs: "100vw", sm: 600 } }} role="presentation">
          {drawerType === "add_edit" && (
            <AddProjectComponent
              cancleFunction={() => toggleDrawer(false)}
              setTaskFunction={setTask}
              task={task}
              project={editProject}
            />
          )}
          {drawerType === "comments" && (
            <CommentsComponent
              task={task}
              project={editProject}
              cancleFunction={() => toggleDrawer(false)}
              setTaskFunction={setTask}
            />
          )}
          {drawerType === "import" && (
            <ImportProjectComponent
              task={task}
              cancleFunction={() => toggleDrawer(false)}
              setTaskFunction={setTask}
            />
          )}
          {drawerType === "notifications" && (
            <NotificationsComponent
              task={task}
              project={editProject}
              cancleFunction={() => toggleDrawer(false)}
              setTaskFunction={setTask}
            />
          )}
        </Box>
      </Drawer>
    </>
  );
}
