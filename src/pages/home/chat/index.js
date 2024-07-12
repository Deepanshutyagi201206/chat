import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import style from "./style.module.css";
import { Input } from "../../../components/input";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import getRequest from "../../../requests/get";
import { getLoggedInUserId } from "../../../functions";
import socket from "../../../socket";
import moment from "moment";

export const Chat = ({ activeUser, messages, setMessages, onlineOfflineUsers }) => {

  const currentUserId = getLoggedInUserId();

  const [user, setUser] = useState();

  const [inputValue, setInputValue] = useState();

  const getUser = async () => {
    try {
      const res = await getRequest({ url: `/user/${activeUser}` });

      const { user } = res?.data;

      if (user) {
        setUser(user);
      }


    } catch (err) {
      return err;
    }
  };

  const getConnectedUser = async () => {
    try {
      const res = await getRequest({ url: `/connected-user/${currentUserId}/${activeUser}` });

      const { user } = res?.data;

      if (user) {
        setMessages(user?.messages)
      }


    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    if (activeUser) {
      getUser()
      getConnectedUser();

    }
  }, [activeUser]);

  const handleClickOnSend = () => {

    socket.emit("message", {
      from: currentUserId,
      to: activeUser,
      message: {
        message: inputValue,
        date: new Date(),
        userId: currentUserId,
      },
    });

    setMessages((prev) => {
      return [...prev, {
        message: inputValue,
        date: new Date(),
        userId: currentUserId,
      }]
    })

    setInputValue('')

  };

  return (
    <div className={style.chat}>
      <div className={style.chatheader}>
        <div className={style.headUser}>
          <AccountCircleIcon />
          <div>
            <p className={style.name}>{user?.name}</p>
            {onlineOfflineUsers.includes(user?._id) ? <p className={`${style.status} ${style.online}`}>Online </p> : <p className={`${style.status} ${style.offline}`}>Offline </p>}
          </div>
        </div>
        <div>
          <MoreVertIcon />
        </div>
      </div>
      <div id="messages-container" className={style.messages}>
        {messages.map((item) => {
          return (
            <div
              className={
                item?.userId === currentUserId
                  ? style.firstPersonMsgs
                  : style.secondPersonMsgs
              }
            >
              <div
                className={
                  item?.userId === currentUserId
                    ? style.firstPersonMsg
                    : style.secondPersonMsg
                }
              >
                <div className={style.nameTimeContainer}>
                  <div>
                    <p className={style.name}>{item?.userId === currentUserId ? "You" : user?.name}</p>
                    <p className={style.time}>{moment(item.date).format('LT')}</p>
                  </div>

                  <div>
                    <MoreVertIcon />
                  </div>
                </div>
                <p className={style.message}>{item.message}</p>
              </div>
              {/* <div className={style.firstPersonMsg}>
            <p className={style.message}>I am sending message</p>
          </div> */}
            </div>
          );
        })}
      </div>
      <div className={style.input}>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          label={"Enter message"}
          style={{ width: "100%" }}
        />
        <button type="buton" onClick={() => {
          handleClickOnSend()
        }}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};
