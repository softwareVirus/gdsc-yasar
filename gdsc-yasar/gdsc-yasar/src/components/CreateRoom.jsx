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
import axios from "axios";
import { redirectLocation } from "../utils/routerHelper";

function CreateRoom() {
  const [code, setCode] = useState(null);
  const { updateGameState } = useGame();
  const userContext = useUser();

  const navigate = useNavigate();
  const handleClick = async (e) => {
    const { user, updateUser } = userContext;
    console.log(code, user);
    // Validate our form inputs and return validation errors via useActionData()
    if (code === null) {
      return {
        error: "You must provide a username to log in",
      };
    }

    // Sign in and redirect to the proper destination if successful.
    try {
      console.log(code, user);
      const response = await axios.post("/game/create_game", {
        roomCode: code,
      });
      console.log(response.data, user);
      if (response.status == 400) throw new Error(response.message);
      updateGameState(response.data.game);
      updateUser({
        createdGame: response.data.game._id,
      });
      let redirectTo = redirectLocation(user, response.data);
      return navigate(redirectTo);
    } catch (error) {
      console.log(code, user, error);
      // Unused as of now but this is how you would handle invalid
      // username/password combinations - just like validating the inputs
      // above
      console.log(error);
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
