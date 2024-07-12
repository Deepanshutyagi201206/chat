import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const SideBar = ({ setIsAddUserPopUp, users, setActiveUser, activeUser, onlineOfflineUsers }) => {

  return (
    <div className={style.sideBar}>
      <div className={style.header}>
        <h1>Chats</h1>
      </div>
      <div className={style.usersContainer}>
        {users.map((item) => {
          return (
            <button
              onClick={() => {
                setActiveUser(item._id)
              }}
              key={item?._id}
              className={`${style.button} ${item._id === activeUser ? style.active : ""
                }`}
            >
              <AccountCircleIcon />
              <div>
                <p className={style.name}>{item?.name}</p>
                {onlineOfflineUsers.includes(item._id) ? <p className={`${style.status} ${style.online}`}>Online </p> : <p className={`${style.status} ${style.offline}`}>Offline </p>}

              </div>
            </button>
          );
        })}
      </div>
      <div className={style.addUserContainer}>
        <button
          onClick={() => {
            setIsAddUserPopUp(true)
          }}
        >

          <PersonAddIcon />
          <div>
            <p className={style.name}>Add User</p>
          </div>
        </button>
      </div>
    </div>
  );
};
