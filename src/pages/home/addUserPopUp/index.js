import { useEffect, useState } from "react";
import style from "./style.module.css"
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Dialog } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import getRequest from "../../../requests/get";
import { getLoggedInUserId } from "../../../functions";

const AddUserPopUp = ({ activeUserRef, setIsAddUserPopUp, isAddUserPopUp, setActiveUser }) => {

    const [users, setUsers] = useState([]);

    const handleGetUsers = async () => {
        try {
            const res = await getRequest({ url: "/users" });

            const { users } = res?.data;

            setUsers(users);
        } catch (err) {
            return err;
        }
    };
    useEffect(() => {
        handleGetUsers();
    }, []);

    return <Dialog onClose={() => { setIsAddUserPopUp(false) }} open={isAddUserPopUp}>
        <div className={style.popUp}>
            <div className={style.header}>
                <p>Add User</p>

                <button onClick={() => {
                    setIsAddUserPopUp(false)
                }}><ClearIcon /></button>
            </div>

            <div className={style.usersContainer}>
                {users.map((item) => {
                    return (

                        item._id != getLoggedInUserId() ?
                            <button
                            
                                onClick={() => {
                                    setActiveUser(item._id)
                                    activeUserRef.current = item._id
                                    setIsAddUserPopUp(false)
                                }}
                                key={item?._id}
                                className={style.button}
                            >
                                <AccountCircleIcon />
                                <div>
                                    <p className={style.name}>{item?.name}</p>
                                    <p className={style.phone}>{item?.phone}</p>
                                    
                                </div>
                            </button> : ""

                    );
                })}
            </div>
        </div>
    </Dialog >
}

export default AddUserPopUp