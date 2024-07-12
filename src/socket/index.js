import { io } from "socket.io-client";
import { getLoggedInUserId } from "../functions";

const socket = io("http://localhost:5000", {
    autoConnect: false,
});

export default socket