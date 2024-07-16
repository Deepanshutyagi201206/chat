import { Toaster } from "react-hot-toast";
import { Router } from "./routes";
import { useEffect } from "react";
import socket from "./socket";
import { getLoggedInUserId, getToken } from "./functions";

function App() {

  useEffect(() => {

    const token = getToken()
    const id = getLoggedInUserId()

    if (id && token) {
      socket.auth = { token: token, userId: id };
      socket.connect()
    }

    socket.on("connect", () => {

      console.log("disconnect", socket.id);

    })

    socket.on("disconnect", () => {
      console.log("disconnect", socket.id); // undefined
    });


    socket.on("connect_error", (err) => {
      console.log("socket err", err)
    });

  }, []);

  return (
    <>
      <Router />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
