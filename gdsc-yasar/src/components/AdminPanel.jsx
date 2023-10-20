import React, { useCallback, useEffect, useState } from "react";
import UserList from "./UserList";
import Button from "./Button";
import { socket } from "../socket";
import { useGame } from "../context/gameProvider";

const AdminPanel = () => {
  const { updateGameState } = useGame();
  const [isStarted, setIsStarted] = useState(false);
  const handleClickStart = () => {
    console.log("here");
    if (!isStarted) {
      socket.emit("start");
      setIsStarted(true);
    } else {
      socket.emit("next")
    }
    socket.on("sorugeldi", (data) => {
      console.log("socket");
      updateGameState(data);
    });
    socket.off("sorugeldi");
  };

  return (
    <div>
      <UserList />
      <Button
        content={"Oyunu Başlat"}
        onClick={handleClickStart}
        className={"primary-button"}
      />
    </div>
  );
};

export default AdminPanel;
