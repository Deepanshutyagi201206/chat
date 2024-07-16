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
import { Avatar } from "@mui/material";

export const Chat = ({ activeUser, messages, setMessages, user, setUsers, users }) => {

  const currentUserId = getLoggedInUserId();

  const [inputValue, setInputValue] = useState();

  const getConnectedUser = async () => {
    try {
      const res = await getRequest({ url: `/connected-user/${currentUserId}/${activeUser}` });

      const { user } = res?.data;

      if (user) {
        setMessages(user?.messages)
      }
      else {
        setMessages([])
      }


    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    if (activeUser) {
      getConnectedUser();

    }

  }, [activeUser]);

  const handleClickOnSend = () => {

    const foundUser = users.find((item) => {

      return item._id == activeUser

    })

    if (!foundUser) {
      setUsers((prev) => {
        return [
          ...prev, {
            name: user?.name,
            _id: user?._id,
            messages: [
              {
                message: inputValue,
                date: new Date(),
              }
            ]
          }
        ]
      })
    }



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
          <p className={style.avatar}>{user?.name?.substring(0, 1)}</p>
          <div>
            <p className={style.name}>{user?.name}</p>
            <p className={`${style.status}`}>{user?.status} </p>
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
              key={item._id}
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
