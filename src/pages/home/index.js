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
  const [messages, setMessages] = useState([]);
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

    const activeUser = localStorage.getItem("activeUser")
    const users = usersRef.current

    const user = users.find((item) => {

      return item._id == data.from

    })

    if (!user) {
      
      handleGetUsers();
    }

    if (data.from == activeUser) {

      setMessages((prev) => {
        return [...prev, data.message]
      })
    }

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

    socket.emit("updateStatus", {
      id: getLoggedInUserId(),
      status: "Online"
    })

    socket.on("getStatus", (data) => {

      const activeUser = localStorage.getItem("activeUser")

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
        <SideBar activeUser={activeUser} setActiveUser={setActiveUser} setIsAddUserPopUp={setIsAddUserPopUp} users={users} />

        {activeUser ? <Chat users={users} setUsers = {setUsers} user={user} activeUser={activeUser} setMessages={setMessages} messages={messages} /> : <NoActiveChat />}

      </div>

      {
        isAddUserPopUp ? <AddUserPopUp setActiveUser={setActiveUser} isAddUserPopUp={isAddUserPopUp} setIsAddUserPopUp={setIsAddUserPopUp} /> : ""
      }
    </>
  );
};
