import React from "react";
import style from "./style.module.css";
import MessageIcon from '@mui/icons-material/Message';

export const NoActiveChat = () => {

  return (
    <div className={style.noChat}>
      <MessageIcon />
      <p>There is no message, Please start conversation</p>
    </div>
  );
};
