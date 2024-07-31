import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { Input } from "../../../components/input";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import getRequest from "../../../requests/get";
import { getLoggedInUserId } from "../../../functions";
import socket from "../../../socket";
import moment from "moment";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import globalStyles from "../../../index.module.css"

export const Chat = ({ newMessages, setNewMessages, activeUser, messages, setMessages, user, updateConnectedUser }) => {

  const currentUserId = getLoggedInUserId();

  const [inputValue, setInputValue] = useState();

  const getConnectedUser = async () => {
    try {
      const res = await getRequest({ url: `/connected-user/${currentUserId}/${activeUser}` });

      const { user } = res?.data;

      if (user) {
        setMessages(user?.messages)
        setNewMessages(user?.newMessages)
      }
      else {
        setMessages([])
        setNewMessages([])
      }


    } catch (err) {
      return err;
    }
  };


  useEffect(() => {


    if (activeUser) {

      if (newMessages.length > 0) {

        let userId
        const tempNewMessages = [...newMessages]

        tempNewMessages.forEach((item) => {
          userId = item.userId
          item.isRead = true
          item.isDelivered = true
        })

        const data = {
          userId: userId,
          messages: tempNewMessages
        }
        socket.emit("read", data)
        updateConnectedUser(activeUser)
      }

    }

  }, [activeUser, newMessages]);

  useEffect(() => {
    if (activeUser) {

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
                    <p className={style.time}>{moment(item.date).calendar()}</p>
                  </div>
                </div>
                <div className={style.messageCheckContainer}>
                  <p className={style.message}>{item.message}</p>

                  {item?.userId === currentUserId ? <>{item?.isRead ? <div className={`${globalStyles.messageCheck} ${style.read}`}><DoneAllIcon /></div> : <div className={`${globalStyles.messageCheck} ${globalStyles.unread}`}><CheckIcon /></div>}</> : ""}

                </div>

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
