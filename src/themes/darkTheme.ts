import { createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      dark: "#9B000E",
      main: "#C50014",
      light: "#EC0016",
    },
    secondary: {
      dark: "#282D37",
      main: "#3C414B",
      light: "#646973",
    },
  },
});

export default darkTheme;
