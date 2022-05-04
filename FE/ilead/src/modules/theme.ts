import { createTheme } from "@mui/material/styles";

const rawTheme = createTheme({
  palette: {
    primary: {
      light: "#69696a",
      main: "#28282a",
      dark: "#1e1e1f",
    },
    secondary: {
      light: "#fff5f8",
      main: "#ff3366",
      dark: "#e62958",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      ::-webkit-scrollbar {
        width: 0.6em;
        z-index: 99;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: #FFDFE9;
      }

      ::-webkit-scrollbar-track {
        margin: $size-regular;
        border-radius: 4px;
        background-color: WhiteSmoke;
      }
      `,
    },
  },

  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
  },
});

const fontHeader = {
  fontWeight: rawTheme.typography.fontWeightMedium,
  textTransform: "uppercase",
};

const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
    },
  },
  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      fontSize: 60,
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: 40,
    },
    h3: {
      ...rawTheme.typography.h3,
      ...fontHeader,
      fontSize: 42,
    },
    h4: {
      ...rawTheme.typography.h4,
      ...fontHeader,
      fontSize: 30,
    },
    h5: {
      ...rawTheme.typography.h5,
      ...fontHeader,
      fontSize: 24,
      fontWeight: rawTheme.typography.fontWeightLight,
    },
    h6: {
      ...rawTheme.typography.h6,
      fontSize: 16,
    },
  },
};

export default theme;
