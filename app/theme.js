"use client";

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false
  },
  fonts: {
    heading: "var(--font-display), serif",
    body: "var(--font-body), sans-serif"
  },
  colors: {
    forest: {
      50: "#eef5f3",
      100: "#d0e2db",
      200: "#b1cfc4",
      300: "#8db8a9",
      400: "#6ca18f",
      500: "#4f8876",
      600: "#3a6b5d",
      700: "#2a4f45",
      800: "#1c352f",
      900: "#0e1b18"
    },
    sand: {
      50: "#fbfaf8",
      100: "#f2f0ea",
      200: "#e6e1d7",
      300: "#d6cdbf",
      400: "#c5b7a7",
      500: "#b4a18f"
    }
  },
  styles: {
    global: {
      body: {
        bg: "#f7f7f5",
        color: "#1b1b1b"
      }
    }
  }
});

export default theme;
