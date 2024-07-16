import React, { useState } from "react";
import style from "./style.module.css";
import globalStyle from "../../index.module.css";
import { Input } from "../input";
import { ButtonComp } from "../button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import postRequest from "../../requests/post";
import socket from "../../socket";

export const VerifyOtp = ({ setIsReceivedOtp, phone }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState();

  const handleClickOnVerify = async () => {
    try {
      const body = {
        phone: phone,
        otp: otp,
      };
      const res = await postRequest({ url: "/verify-otp", body: body });

      if (res?.data?.token) {
        const { token, _id } = res?.data
        localStorage.setItem("id", _id);
        localStorage.setItem("token", token);

        socket.auth = { token: token, userId: _id };
        socket.connect()

        navigate(`/home`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={globalStyle.boxContainer}>
      <div className={globalStyle.box}>
        <button
          className={style.back}
          onClick={() => {
            setIsReceivedOtp(false);
          }}
        >
          <KeyboardBackspaceIcon />
        </button>
        <h1>Verify otp</h1>
        <Input
          onChange={(e) => {
            setOtp(e.target.value);
          }}
          id=""
          label="Enter otp"
          variant="outlined"
        />

        <ButtonComp
          onClick={() => {
            handleClickOnVerify();
          }}
          variant="contained"
          label="Verify"
        />
      </div>
    </div>
  );
};
