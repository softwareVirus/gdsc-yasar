import React, { useEffect, useState } from "react";
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

function JoinRoom() {
  const [code, setCode] = useState(null);
  const { updateGameState } = useGame();
  const userContext = useUser();
  const navigate = useNavigate();
  const handleClick = async (e) => {
    const { user, updateUser } = userContext;
    // Validate our form inputs and return validation errors via useActionData()
    if (code === null) {
      return {
        error: "You must provide a username to log in",
      };
    }
    console.log(code, user);
    let tmp;
    // Sign in and redirect to the proper destination if successful.
    try {
      const response = await axios.post(`/game/join_room/${code}`, {
        roomCode: code,
      });
      if (response.status === 400) throw new Error(response.message);
      tmp = response.data;
      updateGameState(response.data.game);
      updateUser({
        ...response.data.user,
        ranking: response.data.ranking,
      });
    } catch (error) {
      // Unused as of now but this is how you would handle invalid
      // username/password combinations - just like validating the inputs
      // above
      console.log(error);
      return {
        error: "Invalid login attempt",
      };
    }
    let redirectTo = redirectLocation(user, tmp);
    return navigate(redirectTo);
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
          content={"Oyuna Katıl"}
          className={"primary-button"}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default JoinRoom;
