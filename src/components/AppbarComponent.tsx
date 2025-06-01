import { DarkMode, Home, LightMode } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Stack, Toolbar } from "@mui/material";
import useSettingsStore from "../stores/useSettingsStore";
import { useNavigate } from "react-router";

export interface AppbarLink {
  label: string;
  path: string;
}

export interface AppbarProps {
  links?: AppbarLink[];
}

export default function AppbarComponent(props: AppbarProps) {
  const { theme, toggleTheme } = useSettingsStore();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Stack direction="row" spacing={1} flexGrow={1} alignItems="center">
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <Home />
            </IconButton>
            {props.links &&
              props.links.map((link, index) => (
                <Button
                  key={index}
                  color="inherit"
                  onClick={() => navigate(link.path)}
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
