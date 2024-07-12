import React, { useState } from "react";
import globalStyle from "../../index.module.css";
import { Link } from "react-router-dom";
import { Input } from "../../components/input";
import { ButtonComp } from "../../components/button";
import { VerifyOtp } from "../../components/verifyOtp";
import postRequest from "../../requests/post";

export const Login = () => {
  const [isReceivedOtp, setIsReceivedOtp] = useState(false);

  const [phone, setPhone] = useState();

  const handleClickOnContinue = async () => {
    try {
      const res = await postRequest({
        url: "/log-in",
        body: { phone: phone },
      });

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
        <VerifyOtp setIsReceivedOtp={setIsReceivedOtp} phone={phone} />
      ) : (
        <div className={globalStyle.boxContainer}>
          <div className={globalStyle.box}>
            <h1>Login</h1>
            <Input
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              id=""
              label="Mobile Number"
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
                Don't have account{" "}
                <span>
                  <Link to={"/sign-up"}>Sign up</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
