import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getLoggedInUserId } from "../../../functions";
import socket from "../../../socket";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import getRequest from "../../../requests/get";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import globalStyles from "../../../index.module.css"

export const SideBar = ({ activeUserRef, setIsAddUserPopUp, users, setActiveUser, activeUser }) => {

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const [user, setUser] = useState();

  const getUser = async () => {
    try {
      const res = await getRequest({ url: `/user/${getLoggedInUserId()}` });

      const { user } = res?.data;

      if (user) {
        setUser(user);
      }


    } catch (err) {
      return err;
    }
  };

  useEffect(() => {

    getUser()

  }, []);

  const handleLogout = () => {
    socket.emit("updateStatus", {
      id: getLoggedInUserId(),
      status: "Offline"
    })
    socket.disconnect()
    localStorage.clear()
    sessionStorage.clear()
    navigate("/")
  }

  return (
    <div className={style.sideBar}>
      <div className={style.header}>
        <h1>Chats</h1>

        <div className={style.profileContainer}>
          <button
            className={style.profileButton}
            onClick={() => {
              setOpen(!open)
            }}>
            <AccountCircleIcon />
          </button>
          {
            open ?
              <div className={style.menuContainer}>
                <div className={style.userInfoContainer}>
                  <p>Hi,{user?.name}</p>
                </div>
                <button onClick={handleLogout}>Logout</button>
              </div> : ""
          }
        </div>
      </div>
      <div className={style.usersContainer}>
        {users.map((item) => {
          return (
            <button
              onClick={() => {
                setActiveUser(item._id)
                activeUserRef.current = item._id
              }}
              key={item?._id}
              className={`${style.button} ${item._id === activeUser ? style.active : ""
                }`}
            >
              <div className={style.info}>
                <p className={style.avatar}>{item?.name?.substring(0, 1)}</p>
                <div>
                  <p className={style.name}>{item?.name}</p>
                  <div className={style.messageCheckContainer}>

                    {
                      item?.messages[item?.messages?.length > 1 ? item?.messages?.length - 1 : item?.messages?.length]?.userId === getLoggedInUserId() ? <>{item?.messages[item?.messages?.length > 1 ? item?.messages?.length - 1 : item?.messages?.length]?.isRead ? <div className={`${globalStyles.messageCheck} ${globalStyles.read}`}><DoneAllIcon /></div> : <div className={`${globalStyles.messageCheck} ${globalStyles.unread}`}><CheckIcon /></div>}</> : ""
                    }
                    <p className={`${style.message}`}>
                      {
                        item?.messages[item?.messages?.length - 1]?.message
                      } </p>

                  </div>


                </div>
              </div>
              <div>
                <p className={`${style.time}`}>

                  {
                    moment(item?.messages[item?.messages?.length > 1 ? item?.messages?.length - 1 : item?.messages?.length]?.date).calendar()
                  } </p>
                {
                  item?.newMessages?.length > 0 && item._id != activeUser ? <p className={`${style.badge}`}>{item.newMessages.length} </p> : ""
                }

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
