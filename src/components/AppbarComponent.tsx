import { DarkMode, Home, LightMode } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  useTheme,
} from "@mui/material";
import useSettingsStore from "../stores/useSettingsStore";
import { useLocation, useNavigate } from "react-router";

export interface AppbarLink {
  label: string;
  path: string;
}

export interface AppbarProps {
  // links?: AppbarLink[];
}

const links: AppbarLink[] = [
  { label: "Aufgaben", path: "/tasks" },
  { label: "Benachrichtigungen", path: "/notifications" },
];

export default function AppbarComponent(props: AppbarProps) {
  const { theme, toggleTheme } = useSettingsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const themeMUI = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Stack direction="row" spacing={1} flexGrow={1} alignItems="center">
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <Home />
            </IconButton>
            {links.map((link, index) => (
              <Button
                key={index}
                color="inherit"
                onClick={() => navigate(link.path)}
                sx={{
                  height: 64,
                  borderRadius: 0,
                  px: 2,
                  backgroundColor:
                    "/" + location.pathname.split("/")[1] === link.path
                      ? themeMUI.palette.primary.main
                      : null,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
          <IconButton color="inherit" onClick={() => toggleTheme()}>
            {theme === "light" ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
