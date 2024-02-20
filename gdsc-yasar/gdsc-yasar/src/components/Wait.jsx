import React, { useEffect } from "react";
import { socket } from "../socket";
import { useGame } from "../context/gameProvider";
import { useNavigate } from "react-router-dom";

const Wait = () => {
  const { gameState, updateGameState } = useGame();
  const handleNextQuestionSocket = (data) => {
    console.log("scoket",data);
    updateGameState(data);
    //if (data.currentQuestion !== null) navigate("/gameroom");
  };
  useEffect(() => {
    console.log(gameState, "here");
    localStorage.removeItem("option")
    socket.on("next question", handleNextQuestionSocket);
    socket.on("game finished", () => {
      socket.emit("dashboard");
      socket.on("get dashboard", (data) => {
        updateGameState(data);
      });
    });
    return () => {
      socket.off("next question", handleNextQuestionSocket);
      socket.off("game finished");
      socket.off("get dashboard")
    };
  }, []);
  return (
    <div className="wait-panel">
      <div className="wait-message">
        <h2>WAIT QUESTION</h2>
      </div>
    </div>
  );
};

export default Wait;
