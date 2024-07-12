import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import style from "./style.module.css";
import { Input } from "../../../components/input";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { io } from "socket.io-client";
import getRequest from "../../../requests/get";

export const NoActiveChat = ({ activeUser }) => {
  
  return (
    <div className={style.noChat}>
      <p>There is no active chat</p>
    </div>
  );
};
