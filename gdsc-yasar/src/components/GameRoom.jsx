import React, { useState, useEffect, Fragment } from "react";
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
import rankingLogo from "../assets/image-removebg-preview (1).png";
import { socket } from "../socket";
const GameRoom = () => {
  const { gameState, updateGameState } = useGame();
  const { user } = useUser();
  const navigate = useNavigate();
  const [countdownDuration, setCountdownDuration] = useState(() => {
    let value = localStorage.getItem("time");
    return value !== null ? parseInt(value) : 10;
  });
  console.log(countdownDuration, gameState.currentQuestion);
  const [isAnswering, setIsAnswering] = useState(
    countdownDuration == 0 && gameState.currentQuestion !== null
  );
  const [selectedOption, setSelectedOption] = useState(() => {
    let selected = localStorage.getItem("option");
    return selected != null ? JSON.parse(selected) : null;
  });
  const [timerExpired, setTimerExpired] = useState(false);
  const handleSelection = (index) => {
    if (selectedOption === null) {
      localStorage.setItem("option", index);
      setSelectedOption(index);
    }
  };

  const handleGetDashboardSocket = (data) => {
    console.log(data, "socket1");
    let dashboard = data.map((item, index) => {
      return {
        ...item,
        ranking: index+1,
      };
    });
    setIsAnswering(false);
    updateGameState({
      ...gameState,
      currentQuestion: null,
      dashboard,
    });
    navigate(
      gameState.numberOfQuestions !== gameState.questionNumber
        ? "/wait"
        : "/dashboard"
    );
    console.log(gameState);
  };
  const handleTimerExpired = () => {
    setCountdownDuration(0);
    setIsAnswering(true);
    let interval = setInterval(() => {
      localStorage.setItem("time", 10);
      console.log(
        "here alfabbe",
        timerExpired,
        countdownDuration,
        gameState,
        selectedOption,
        localStorage.getItem("option")
      );
      socket.emit("cevap", {
        cevap:
          localStorage.getItem("option") !== null
            ? gameState.currentQuestion.Cevap ==
              ["A", "B", "C", "D"].map(
                (item) => gameState.currentQuestion[item]
              )[parseInt(localStorage.getItem("option"))]
            : false,
        username: user.username,
      });
      localStorage.removeItem("option");
      socket.emit("dashboard", gameState.dashboard);
      socket.on("getDashboard", handleGetDashboardSocket);
      clearInterval(interval);
    }, 5000);
    setTimerExpired(false);
  };

  const handleTimerUpdate = (countdown) => {
    console.log(countdown);
    setTimerExpired(false);
    localStorage.setItem("time", countdown);
    setCountdownDuration(countdown);
  };
  useEffect(() => {
    // Listen for timer update events from the server
    socket.on("timerUpdate", handleTimerUpdate);

    // Listen for timer expiration events from the server
    socket.on("timerExpired", handleTimerExpired);

    return () => {
      socket.off("getDashboard", handleGetDashboardSocket);
      socket.off("timerExpired", handleTimerExpired);
      socket.off("timerUpdate", handleTimerUpdate);
    };
    // The event listeners will remain active even after the component unmounts
  }, []);
  return (
    <Fragment>
      {!timerExpired && (
        <div className={"question-container"}>
          {isAnswering ? (
            <Fragment>
              <div className={"answer-session"}></div>
              {gameState.currentQuestion.Cevap ==
              ["A", "B", "C", "D"].map(
                (item) => gameState.currentQuestion[item]
              )[selectedOption] ? (
                <div className="display-answer correct-answer">
                  CORRECT ANSWER!
                </div>
              ) : (
                <div className="display-answer wrong-answer">WRONG ANSWER!</div>
              )}
            </Fragment>
          ) : (
            <></>
          )}
          <div className="question-header">
            <div className="question-situation-box">
              {gameState.questionNumber} / {gameState.numberOfQuestions}
            </div>
            <div className="ranking-box">
              <img
                src={rankingLogo}
                alt="ranking logo"
                style={{ width: 41, height: 45 }}
              />
              <span>{user.ranking}th</span>
            </div>
            <div className="time-box">{Math.ceil(countdownDuration)}s</div>
          </div>
          <div className="question-box">
            <div className="question-context">
              {gameState.currentQuestion.Soru}
            </div>
          </div>
          <div className="options-container">
            {["A", "B", "C", "D"]
              .map((item) => gameState.currentQuestion[item])
              .map((item, index) => {
                return (
                  <div
                    className={
                      "option" +
                      (selectedOption === index ? " selected-option" : "") +
                      (isAnswering &&
                      ((gameState.currentQuestion.Cevap == item &&
                        selectedOption == index) ||
                        (gameState.currentQuestion.Cevap == item &&
                          selectedOption != index))
                        ? " correct-answer"
                        : isAnswering &&
                          selectedOption == index &&
                          gameState.currentQuestion.Cevap !=
                            ["A", "B", "C", "D"].map(
                              (item) => gameState.currentQuestion[item]
                            )[selectedOption]
                        ? " wrong-answer"
                        : "")
                    }
                    key={index + "?" + item}
                    onClick={(e) => handleSelection(index)}
                  >
                    {item}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default GameRoom;
