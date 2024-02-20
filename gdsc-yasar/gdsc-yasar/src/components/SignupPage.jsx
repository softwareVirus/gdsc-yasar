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

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const { createErrorMessage } = useError();
  const { updateUser } = useUser();
  const { gameState } = useGame();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    // Validate our form inputs and return validation errors via useActionData()
    if (!email && !password && !firstName && !lastName) {
      createErrorMessage("You must fill all fields to sign up!");
      return;
    }
    let tmp;
    // Sign in and redirect to the proper destination if successful.
    try {
      const response = await axios.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });
      if (response.status === 400) throw new Error(response.message);
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
      createErrorMessage("Try different email!");
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
          <h1>Sign Up</h1>
          <div>
            <div className="form-input-container">
              <input
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-input-container">
              <input
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
              content={"Hesap Oluştur"}
              className={"primary-form-button"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
