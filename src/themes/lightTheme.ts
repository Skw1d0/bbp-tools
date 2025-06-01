import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      dark: "#C50014",
      main: "#EC0016",
      light: "#FCC8C3",
    },
    secondary: {
      dark: "#131821",
      main: "#282D37",
      light: "#878C96",
    },
    background: {
      default: "#F0F3F5",
    },
  },
});

export default lightTheme;
