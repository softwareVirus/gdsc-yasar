import React, { useEffect } from "react";
import { socket } from "../socket";
import { useGame } from "../context/gameProvider";
import { useNavigate } from "react-router-dom";

const Wait = () => {
  const { gameState, updateGameState } = useGame();
  const navigate = useNavigate();
  const handleSoruGeldiSocket = (data) => {
    console.log("scoket");
    updateGameState(data);
    //if (data.currentQuestion !== null) navigate("/gameroom");
  };
  useEffect(() => {
    console.log(gameState, "here");

    socket.on("sorugeldi", handleSoruGeldiSocket);
    socket.on("bitti", () => {
      socket.emit("dashboard");
      socket.on("getDashboard", (data) => {
        updateGameState();
      });
    });
    return () => {
      socket.off("sorugeldi", handleSoruGeldiSocket);
    };
  }, []);
  return (
    <div className="wait-panel">
      <div className="wait-first">
        <div className="wait-red"></div>
        <div className="wait-blue"></div>
      </div>
      <div className="wait-first">
        <div className="wait-green"></div>
        <div className="wait-yellow"></div>
      </div>
      <div className="wait-message">WAIT QUESTION</div>
    </div>
  );
};

export default Wait;
