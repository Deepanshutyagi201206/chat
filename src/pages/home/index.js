import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.css";
import { SideBar } from "./sideBar";
import { Chat } from "./chat";
import AddUserPopUp from "./addUserPopUp";
import getRequest from "../../requests/get";
import { NoActiveChat } from "./noActiveChat";
import socket from "../../socket";
import { getLoggedInUserId } from "../../functions";
import putRequest from "../../requests/put";

export const Home = () => {

  const [isAddUserPopUp, setIsAddUserPopUp] = useState(false)
  const [users, setUsers] = useState([]);
  const usersRef = useRef(users);
  const [activeUser, setActiveUser] = useState()
  const activeUserRef = useRef(activeUser);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [user, setUser] = useState();

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

  const updateConnectedUser = async (secondUserId) => {
    try {
      const res = await putRequest({ url: `/connected-user/${getLoggedInUserId()}/${secondUserId}`, body: { newMessages: [] } });

      const { user } = res?.data;

      if (user) {
        setNewMessages([])
        handleGetUsers();
      }


    } catch (err) {
      return err;
    }
  };

  const handleGetUsers = async () => {
    try {
      const res = await getRequest({ url: `/connected-users/${getLoggedInUserId()}` });

      const { users } = res?.data;

      if (users) {
        setUsers(users);
        usersRef.current = users
      }

    } catch (err) {
      return err;
    }
  };


  const handleMessageTo = ({ data }) => {

    const activeUser = activeUserRef.current

    handleGetUsers();

    if (data.userId == activeUser) {

      updateConnectedUser(data.userId)

      setMessages((prev) => {
        return [...prev, data]
      })
      setNewMessages((prev) => {
        return [...prev, data]
      })
    }

    const dataToBeSend = {
      ...data,
      isDelivered: true,
    }

    console.log("data", dataToBeSend)

    socket.emit("delivered", dataToBeSend)

  }


  useEffect(() => {

    handleGetUsers();

    if (activeUser) {
      getUser()
    }

  }, [activeUser]);

  useEffect(() => {

    handleGetUsers();

    socket.on("messageTo", (data) => {
      handleMessageTo(data)
    })

    socket.on("deliveredMessage", (data) => {

      console.log("deliveredMessage", data)
      // handleMessageTo(data)
    })

    socket.on("read", (data) => {
      console.log("read", data)
    })

    socket.on("updateUsers", (data) => {
      handleGetUsers();
    })

    socket.emit("updateStatus", {
      id: getLoggedInUserId(),
      status: "Online"
    })

    socket.on("getStatus", (data) => {

      const activeUser = activeUserRef.current

      if (activeUser == data.id) {

        setUser((prev) => {
          return {
            ...prev, status: data.status
          }
        })

      }

    })

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
        <SideBar activeUserRef={activeUserRef} updateConnectedUser={updateConnectedUser} activeUser={activeUser} setActiveUser={setActiveUser} setIsAddUserPopUp={setIsAddUserPopUp} users={users} />

        {activeUser ? <Chat newMessages={newMessages} setNewMessages={setNewMessages} updateConnectedUser={updateConnectedUser} users={users} setUsers={setUsers} user={user} activeUser={activeUser} setMessages={setMessages} messages={messages} /> : <NoActiveChat />}

      </div>

      {
        isAddUserPopUp ? <AddUserPopUp activeUserRef={activeUserRef} setActiveUser={setActiveUser} isAddUserPopUp={isAddUserPopUp} setIsAddUserPopUp={setIsAddUserPopUp} /> : ""
      }
    </>
  );
};
