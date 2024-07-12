import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { SideBar } from "./sideBar";
import { Chat } from "./chat";
import AddUserPopUp from "./addUserPopUp";
import getRequest from "../../requests/get";
import { NoActiveChat } from "./noActiveChat";
import socket from "../../socket";
import { getLoggedInUserId } from "../../functions";

export const Home = () => {

  const [isAddUserPopUp, setIsAddUserPopUp] = useState(false)
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState()
  const [messages, setMessages] = useState([]);
  const [onlineOfflineUsers, setOnlineOfflineUsers] = useState([]);

  const handleGetUsers = async () => {
    try {
      const res = await getRequest({ url: `/connected-users/${getLoggedInUserId()}` });

      const { users } = res?.data;

      if (users) {
        setUsers(users);
      }


    } catch (err) {
      return err;
    }
  };

  useEffect(() => {

    socket.on("messageTo", ({ data }) => {

      setMessages((prev) => {
        return [...prev, data.message]
      })

    })

    socket.on("getConnectDisconnect", (data) => {

      if (data.status === "Online") {
        if (!onlineOfflineUsers.includes(data.id)) {
          setOnlineOfflineUsers((...prev) => {
            return [prev, data.id]
          })
        }
      }
      else {
        if (onlineOfflineUsers.includes(data.id)) {
          setOnlineOfflineUsers(onlineOfflineUsers.filter((item) => {
            return item != data.id
          }))
        }
      }
    })

  }, []);

  useEffect(() => {
    handleGetUsers();
  }, []);

  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container")

    if (messagesContainer) {
      messagesContainer.scroll(0, messagesContainer.scrollHeight)
    }
  }, [messages]);

  return (
    <>
      <div className={style.home}>
        <SideBar onlineOfflineUsers={onlineOfflineUsers} activeUser={activeUser} setActiveUser={setActiveUser} setIsAddUserPopUp={setIsAddUserPopUp} users={users} />

        {activeUser ? <Chat onlineOfflineUsers={onlineOfflineUsers} activeUser={activeUser} setMessages={setMessages} messages={messages} /> : <NoActiveChat />}

      </div>

      {
        isAddUserPopUp ? <AddUserPopUp onlineOfflineUsers={onlineOfflineUsers} setActiveUser={setActiveUser} isAddUserPopUp={isAddUserPopUp} setIsAddUserPopUp={setIsAddUserPopUp} /> : ""
      }
    </>
  );
};
