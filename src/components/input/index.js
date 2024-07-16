import React from "react";
import "./style.css";
import { TextField } from "@mui/material";

export const Input = ({ label, id, variant, onChange, ...rest }) => {
  return (
    <TextField
      id={id}
      label={label}
      variant={variant}
      onChange={(e) => {
        onChange(e);
      }}
      {...rest}
    />
  );
};
