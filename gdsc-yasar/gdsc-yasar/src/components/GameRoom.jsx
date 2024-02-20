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
import axios from "axios";
import bcrypt from "../utils/bcrypt";

const GameRoom = () => {
  const { gameState, updateGameState } = useGame();
  const { user, updateUser } = useUser();
  /*console.log(
    new Date(),
    new Date(
      new Date(gameState.questionTime).toLocaleString("en-US", {
        timeZone: "Africa/Addis_Ababa",
      })
    )
  );*/
  const [timerExpired, setTimerExpired] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(
    10 -
      (new Date().getTime() -
        new Date(
          new Date(gameState.questionTime).toLocaleString("en-US", {
            timeZone: "Africa/Addis_Ababa",
          })
        ).getTime()) /
        1000
  );
  const [isAnswering, setIsAnswering] = useState(
    countdownDuration == 0 &&
      gameState.questions[gameState.currentQuestionNumber - 1] !== null
  );
  const [selectedOption, setSelectedOption] = useState(() => {
    let selected = localStorage.getItem("option");
    return selected != null ? JSON.parse(selected) : null;
  });
  const handleSelection = (index) => {
    if (selectedOption === null) {
      localStorage.setItem("option", index);
      setSelectedOption(index);
    }
  };

  const convertRanking = (rank) => {
    const rankingShortNames = ["1st", "2nd", "3rd"];
    return rank < 3 ? rankingShortNames[rank] : rank + 1 + "th";
  };

  const generateQuestionResultClassName = (index, item) => {
    let className = "";
    if (selectedOption === index) className += " selected-option";
    if (!isAnswering) return className;
    if (
      item != undefined &&
      bcrypt.compareSync(
        item,
        gameState.questions[gameState.currentQuestionNumber - 1].correctAnswer
      )
    )
      className += " correct-answer";
    if (
      selectedOption == index &&
      gameState.questions[gameState.currentQuestionNumber - 1].options[
        selectedOption
      ] &&
      !bcrypt.compareSync(
        gameState.questions[gameState.currentQuestionNumber - 1].options[
          selectedOption
        ],
        gameState.questions[gameState.currentQuestionNumber - 1].correctAnswer
      )
    )
      className += " wrong-answer";
    return className;
  };

  const handleTimerExpired = async () => {
    setIsAnswering(true);

    axios.post("/game/answer_question/" + gameState._id, {
      answer:
        gameState.questions[gameState.currentQuestionNumber - 1].options[
          selectedOption
        ],
    });
    let interval = setInterval(async () => {
      /*const game = await axios.get("/game/gamestate/" + gameState._id);
      updateGameState(game);*/
      console.log("here");
      localStorage.removeItem("option");
      clearInterval(interval);
    }, 25000);
    setTimerExpired(false);
  };

  useEffect(() => {
    let interval;
    if (countdownDuration > 0) {
      interval = setInterval(() => {
        setCountdownDuration((prev) => prev - 1);
      }, 1000);
    } else {
      handleTimerExpired();
    }
    socket.on("get updated gamestate", (data) => updateGameState(data));
    // Listen for timer update events from the server

    return () => {
      clearInterval(interval);
      socket.off("get ranking");
    };
    // The event listeners will remain active even after the component unmounts
  }, [countdownDuration]);
  return (
    <Fragment>
      {isAnswering &&
      gameState.questions[gameState.currentQuestionNumber - 1].options[
        selectedOption
      ] ? (
        <Fragment>
          <div className={"answer-session"}></div>
          {bcrypt.compareSync(
            gameState.questions[gameState.currentQuestionNumber - 1].options[
              selectedOption
            ],
            gameState.questions[gameState.currentQuestionNumber - 1]
              .correctAnswer
          ) ? (
            <div className="display-answer correct-answer">CORRECT ANSWER!</div>
          ) : (
            <div className="display-answer wrong-answer">WRONG ANSWER!</div>
          )}
        </Fragment>
      ) : (
        <></>
      )}
      <div className={"question-container"}>
        <div className="question-header">
          <div className="question-situation-box">
            {gameState.currentQuestionNumber} / {gameState.questions.length}
          </div>
          <div className="ranking-box">
            <img
              src={rankingLogo}
              alt="ranking logo"
              style={{ width: 41, height: 45 }}
            />
            <span>
              {convertRanking(
                gameState.participants
                  .sort((a, b) => b.score - a.score)
                  .map((item) => item.user._id)
                  .indexOf(user._id)
              )}
            </span>
          </div>
          <div className="time-box">{Math.ceil(countdownDuration)}s</div>
        </div>
        <div className="question-box">
          <div className="question-context">
            {gameState.questions[gameState.currentQuestionNumber - 1].question}
          </div>
        </div>
        <div className="options-container">
          {gameState.questions[gameState.currentQuestionNumber - 1].options.map(
            (item, index) => {
              return (
                <div
                  className={
                    "option" + generateQuestionResultClassName(index, item)
                  }
                  key={index + "?" + item}
                  onClick={(e) => handleSelection(index)}
                >
                  {item}
                </div>
              );
            }
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default GameRoom;
