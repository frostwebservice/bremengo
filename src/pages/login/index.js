import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  authenticate,
  deauthenticate,
} from "../../features/firebase/authChecker";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useState, useEffect } from "react";
import logoImg from "../../images/logo/hbv_logo_freigestellt.png";
import "./index.css";
import { Input } from "@material-tailwind/react";
import { Helmet } from "react-helmet";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticateUser = () => {
    dispatch(authenticate());
    navigate("/dashboard");
  };
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const SignInWithEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setIsError(true);
      setErrorMsg("Provide Eamil and Password!");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then(async (data) => {
        const id_token = await data.user.getIdToken();
        localStorage.setItem("id_token", id_token);
        localStorage.setItem("is_authenticated", "true");
        navigate("/dashboard");
        // window.location.href = "/dashboard";
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setIsError(true);

      setErrorMsg("Invalid Email or Password! Try again!");
      // console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login/Anmeldung | BremenGo</title>
        <meta name="description" content="BremenGo Login" />
      </Helmet>

      <div className="mt-[3.125rem] mb-[3.125rem]">
        <div className="container mx-auto">
          <div className="grid grid-cols-3">
            <div className="col-span-2"></div>
            <div className="">
              <div className="logo-main">
                <div className="logo-app">
                  <img src={logoImg} alt="logo" title="logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[9.375rem]">
        <div className="mb-[2.5rem]">
          <div className="container m-auto">
            <div className="grid grid-cols-3 text-center">
              <div className="col-start-2 login-headline has-special-corners">
                <h1>BremenGo</h1>
                <h2>Editor</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container m-auto">
          <form autoComplete="off">
            <div className="flex w-72 flex-col items-end gap-4 m-auto mt-20">
              <input type="text" name="dummy" style={{ display: "none" }} />
              <Input
                size="md"
                className="bg-white"
                autoComplete="new-email"
                label="Name / E-Mail"
                value={email}
                onChange={(e) => {
                  setIsError(false);
                  setEmail(e.target.value);
                }}
              />
              <Input
                size="md"
                className="bg-white"
                label="Passwort"
                autoComplete="new-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setIsError(false);
                  setPassword(e.target.value);
                }}
              />
              {isError ? <p className="text-red-800">{errorMsg}</p> : null}
              <div className="relative mt-8">
                <button
                  className="login-btn hover:text-white"
                  onClick={SignInWithEmail}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
