import React, { useState } from "react";
import {
  Form,
  useActionData,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { useGame } from "../context/gameProvider";
import { useUser } from "../context/userProvider";
import { socket } from "../socket";

function CreateRoom() {
  const [code, setCode] = useState(null);
  const gameContext = useGame()
  const userContext = useUser()
  const navigate = useNavigate();
  const handleClick = (e) => {
    const { user } = userContext;
    // Validate our form inputs and return validation errors via useActionData()
    if (!code) {
      return {
        error: "You must provide a username to log in",
      };
    }

    // Sign in and redirect to the proper destination if successful.
    try {
      socket.emit("odaKatil", {
        username: user.username,
        odaAdi: code,
      });
      socket.on("odaOluştur", (data) => {
        gameContext.updateGameState(data);
        navigate("/admin/panel");
      });
    } catch (error) {
      // Unused as of now but this is how you would handle invalid
      // username/password combinations - just like validating the inputs
      // above
      console.log(error)
      return {
        error: "Invalid login attempt",
      };
    }

  };
  return (
    <div>
      <div className="layout">
        <Input
          width={21.3125}
          placeholder="KODU GİRİN"
          maxLength={6}
          name={"room-code"}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          content={"Oyunu Oluştur"}
          className={"primary-button"}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default CreateRoom;
