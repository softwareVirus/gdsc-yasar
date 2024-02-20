import React, { Fragment, useCallback, useEffect, useState } from "react";
import UserList from "./UserList";
import Button from "./Button";
import { socket } from "../socket";
import { useGame } from "../context/gameProvider";
import UserCard from "./UserCard";
import DashboardUserCard from "./DashboardUserCard";
import axios from "axios";

const AdminPanel = () => {
  const { updateGameState, gameState } = useGame();
  const [isStarted, setIsStarted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClickStart = async () => {
    console.log("here");
    const response = await axios.post("/game/next_question/" + gameState._id, {
      roomCode: gameState.roomCode,
      currentQuestionNumber: gameState.currentQuestionNumber,
      isGameStarted: gameState.isGameStarted,
    });
    console.log(response);
    if (response.status === 400) return;
    updateGameState(response.data);
    setIsDisabled(true);
  };

  useEffect(() => {
    socket.on("new person", (data) => {
      console.log(data);
      updateGameState(data);
    });
    socket.on("timeout", async () => {
      console.log("timeout", isDisabled);
      const response = await axios.get(`/game/game/${gameState._id}`);
      console.log(response.data);
      updateGameState({
        ...response.data,
        questionTime: null,
      });
      setIsDisabled(false);
    });
    return () => {
      socket.off("new person");
      socket.off("timeout");
    };
  }, [isDisabled]);

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <div className="admin-panel-header-info-box">
          <div className="admin-panel-statu-box">
            <h2>Oyun Kodu</h2>
            <h3>{gameState.roomCode}</h3>
          </div>
          {gameState.isGameStarted && (
            <div className="admin-panel-statu-box">
              <h2>Current Question</h2>
              <h3>
                {gameState.currentQuestionNumber <= gameState.questions.length
                  ? gameState.currentQuestionNumber
                  : gameState.questions.length}{" "}
                / {gameState.questions.length}
              </h3>
            </div>
          )}
          <div className="admin-panel-statu-box">
            <h2>Toplam Katılımcı</h2>
            <h3>{gameState.participants.length}</h3>
          </div>
        </div>
        {gameState.isGameStarted ? (
          gameState.currentQuestionNumber < gameState.questions.length ? (
            <Fragment>
              <div className="after-game-started-panel">
                <Button
                  content={"Sıradaki Soru"}
                  onClick={handleClickStart}
                  className={"primary-button gdsc-yellow center-with-margin"}
                  disabled={isDisabled}
                />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="after-game-started-panel">
                <Button
                  content={"Oyunu Bitir"}
                  onClick={handleClickStart}
                  className={"primary-button gdsc-red center-with-margin"}
                  disabled={isDisabled}
                />
              </div>
            </Fragment>
          )
        ) : (
          <Button
            content={"Oyunu Başlat"}
            onClick={handleClickStart}
            className={"primary-button"}
            disabled={isDisabled}
          />
        )}
      </div>
      <div className="user-card-list-container">
        {gameState.isGameStarted ? (
          <Fragment>
            <div className="dashboard-user-list-header">
              <div className="ranking">
                <p>Ranking</p>
              </div>
              <div className="name">
                <p>Name</p>
              </div>
              <div className="score">
                <p>Score</p>
              </div>
            </div>
            <div className="dasboard-user-card-list">
              {gameState.participants
                .sort((a, b) => b.score - a.score)
                .map((item, index) => {
                  return <DashboardUserCard {...item} ranking={index + 1} />;
                })}
            </div>
          </Fragment>
        ) : (
          <div className="user-card-list">
            {gameState.participants.map((item, index) => {
              return <UserCard {...item} ranking={index + 1} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
