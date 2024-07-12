import React, { useState } from "react";
import globalStyle from "../../index.module.css";
import { Link } from "react-router-dom";
import { Input } from "../../components/input";
import { ButtonComp } from "../../components/button";
import { VerifyOtp } from "../../components/verifyOtp";
import postRequest from "../../requests/post";

export const SignUp = () => {
  const [isReceivedOtp, setIsReceivedOtp] = useState(false);
  const [signUp, setSignUp] = useState({
    name: "",
    phone: "",
  });

  const handleClickOnContinue = async () => {
    try {
      const res = await postRequest({ url: "/sign-up", body: signUp });

      console.log(res?.data?.otp);

      if (res?.data?.otp) {
        setIsReceivedOtp(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isReceivedOtp ? (
        <VerifyOtp setIsReceivedOtp={setIsReceivedOtp} phone={signUp?.phone} />
      ) : (
        <div className={globalStyle.boxContainer}>
          <div className={globalStyle.box}>
            <h1>Sign up</h1>
            <Input
              onChange={(e) => {
                setSignUp((prev) => {
                  return {
                    ...prev,
                    name: e.target.value,
                  };
                });
              }}
              id="name"
              label="Enter name"
              variant="outlined"
            />
            <Input
              onChange={(e) => {
                setSignUp((prev) => {
                  return {
                    ...prev,
                    phone: e.target.value,
                  };
                });
              }}
              id="phone"
              label="Enter phone"
              variant="outlined"
            />

            <ButtonComp
              onClick={() => {
                handleClickOnContinue();
              }}
              variant="contained"
              label="Continue"
            />

            <div className={globalStyle.bottom}>
              <p>
                Already have account{" "}
                <span>
                  <Link to={"/"}>Login</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
