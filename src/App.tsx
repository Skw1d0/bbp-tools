import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router";
import useSettingsStore from "./stores/useSettingsStore";
import darkTheme from "./themes/darkTheme";
import lightTheme from "./themes/lightTheme";
import router from "./routes";

function App() {
  const { theme } = useSettingsStore();

  return (
    <div className="App">
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
