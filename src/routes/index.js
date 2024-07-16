import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../pages/login";
import { SignUp } from "../pages/signUp";
import { Home } from "../pages/home";
import Authenticate from "./authenticate";
import IsLoggedIn from "./isLoggedIn";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<IsLoggedIn />}>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<Authenticate />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
