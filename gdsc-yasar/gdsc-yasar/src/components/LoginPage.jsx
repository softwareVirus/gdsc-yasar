import React, { useState } from "react";
import {
  Form,
  useActionData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Input from "./Input";
import { socket } from "../socket";
import Button from "./Button";
import { useUser } from "../context/userProvider";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useGame } from "../context/gameProvider";
import { redirectLocation } from "../utils/routerHelper";
import { useError } from "../context/errorProvider";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { createErrorMessage } = useError();
  const { updateUser } = useUser();
  const { gameState } = useGame();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    // Validate our form inputs and return validation errors via useActionData()
    if (!email && !password) {
      createErrorMessage("You must fill all fields to log in!");
      return;
    }
    let tmp;
    // Sign in and redirect to the proper destination if successful.
    try {
      const response = await axios.post("/auth/login/password", {
        email,
        password,
      });
      if (response.status === 400) throw new Error(response.message);
      console.log(response)
      tmp = {
        ...response.data,
        isAdmin: response.data.isAdmin,
      };
      updateUser({
        ...response.data,
        isAdmin: response.data.isAdmin,
      });
    } catch (error) {
      console.log(error);
      createErrorMessage("You entered wrong email or password!")
      // Unused as of now but this is how you would handle invalid
      // username/password combinations - just like validating the inputs
      // above
      return {
        error: "Invalid login attempt",
      };
    }

    let redirectTo = redirectLocation(tmp, gameState);
    console.log(redirectTo);
    return navigate(redirectTo);
  };
  return (
    <div className="login-container">
      <div className="login-hero">
        <div className="login-hero-thumbnail">
          <img src="/src/assets/v-color.png" />
        </div>

        <div className="form-container">
          <h1>Log in</h1>
          <div>
            <div className="form-input-container">
              <input
                placeholder="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-input-container">
              <input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              content={"Giriş Yap"}
              className={"primary-form-button"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
