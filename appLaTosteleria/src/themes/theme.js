import { createTheme } from "@mui/material/styles";

const displayFont = '"Cormorant Garamond", Georgia, serif';
const bodyFont = '"Nunito Sans", "Segoe UI", sans-serif';

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7E0F06",
      contrastText: "#FFF7ED",
    },
    secondary: {
      main: "#E8C38C",
      contrastText: "#4A2A16",
    },
    background: {
      default: "#F7EEE2",
      paper: "#FFF9F1",
    },
    text: {
      primary: "#2E1B12",
      secondary: "#6F4B35",
    },
    primaryLight: {
      main: "#7E0F06",
      contrastText: "#E8C38C",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: bodyFont,
    h1: {
      fontFamily: displayFont,
      fontWeight: 700,
      letterSpacing: "0.02em",
    },
    h2: {
      fontFamily: displayFont,
      fontWeight: 700,
      letterSpacing: "0.02em",
    },
    h3: {
      fontFamily: displayFont,
      fontWeight: 700,
      letterSpacing: "0.015em",
    },
    h4: {
      fontFamily: displayFont,
      fontWeight: 700,
    },
    h5: {
      fontFamily: displayFont,
      fontWeight: 700,
    },
    h6: {
      fontFamily: displayFont,
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html {
          scroll-behavior: smooth;
        }

        body {
          background:
            radial-gradient(circle at top left, rgba(126, 15, 6, 0.1), transparent 28%),
            radial-gradient(circle at top right, rgba(232, 195, 140, 0.3), transparent 26%),
            linear-gradient(180deg, #fbf2e5 0%, #f4e1c5 100%);
          color: #2e1b12;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        ::selection {
          background: rgba(126, 15, 6, 0.18);
          color: #2e1b12;
        }
      `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: "linear-gradient(90deg, #7E0F06 0%, #611006 100%)",
          boxShadow: "0 12px 30px rgba(68, 20, 10, 0.25)",
          borderBottom: "1px solid rgba(232, 195, 140, 0.3)",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "clamp(16px, 3vw, 32px)",
          paddingRight: "clamp(16px, 3vw, 32px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 14px 36px rgba(78, 36, 16, 0.12)",
          border: "1px solid rgba(126, 15, 6, 0.08)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,241,0.98))",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,241,0.98))",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 18,
          paddingBlock: 10,
          boxShadow: "none",
        },
        contained: {
          boxShadow: "0 10px 24px rgba(126, 15, 6, 0.18)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
  },
});