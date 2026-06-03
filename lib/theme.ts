"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6EE7B7",       // emerald accent
      light: "#A7F3D0",
      dark: "#34D399",
    },
    secondary: {
      main: "#F59E0B",        // amber for Placement
    },
    background: {
      default: "#0A0F1E",     // deep navy
      paper: "#0F1729",       // slightly lighter navy
    },
    text: {
      primary: "#E2E8F0",
      secondary: "#94A3B8",
    },
    error: { main: "#F87171" },
    warning: { main: "#FBBF24" },
    success: { main: "#6EE7B7" },
    divider: "rgba(100,116,139,0.2)",
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(100,116,139,0.15)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderBottom: "1px solid rgba(100,116,139,0.15)",
        },
      },
    },
  },
});

export default theme;
