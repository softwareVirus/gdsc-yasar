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
import { Navigate  } from "react-router-dom";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(false);
  const { updateUser } = useUser()
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    console.log(username);
    // Validate our form inputs and return validation errors via useActionData()
    if (!username) {
      return {
        error: "You must provide a username to log in",
      };
    }
    let tmp;
    // Sign in and redirect to the proper destination if successful.
    try {
      console.log("here");
      socket.emit("odaKatil", {
        username,
        odaAdi: roomCode,
      });
      tmp = await new Promise((resolve, reject) => {
        socket.on("siralama", (data) => {
          updateUser({
            username,
            ranking: data,
            admin: data === 0,
          });
          resolve({
            username,
            ranking: data,
            admin: data === 0,
          });
        });
        socket.on("hataliAd",() => {
          setError(true)
          console.log(error)
          setInterval(() => {
            setError(false)
          },1500);
        })
      });
    } catch (error) {
      console.log(error);
      // Unused as of now but this is how you would handle invalid
      // username/password combinations - just like validating the inputs
      // above
      return {
        error: "Invalid login attempt",
      };
    }

    let redirectTo = tmp.username
      ? tmp.admin
        ? "/admin"
        : "/wait"
      : null;
    console.log(redirectTo);
    return navigate(redirectTo)
  };
  return (
    <div>
      <div className="layout">
        <Input
          maxWidth={32.26669}
          placeholder="NICKNAME GİRİN"
          maxLength={14}
          name={"nickname"}
          className="username-input"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          maxWidth={21.3125}
          placeholder="KODU GİRİN"
          maxLength={6}
          name={"code"}
          className="code-input"
          onChange={(e) => {
            setRoomCode(e.target.value);
          }}
        />
        <Button content={"Oyuna Katıl"} className={"primary-button"} onClick={handleSubmit} />
        {
          error && 
          <div>
            Try Different Name
          </div>
        }
      </div>
    </div>
  );
}

export default LoginPage;
