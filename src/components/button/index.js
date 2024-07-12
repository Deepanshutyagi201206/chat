import React from "react";
import style from "./style.module.css";
import { Button, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#52a7fb",
      light: "#52a7fb",
      dark: "#52a7fb",
    },
  },
});

export const ButtonComp = ({ label, variant, onClick, ...rest }) => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        color="primary"
        onClick={onClick}
        {...rest}
        className={`${style.button}`}
        variant={variant}
      >
        {label}
      </Button>
    </ThemeProvider>
  );
};
