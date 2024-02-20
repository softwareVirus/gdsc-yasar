import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const GameContext = createContext();

export const useGame = () => {
  return useContext(GameContext);
};

const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState(() => {
    // Initialize the user state from local storage if available
    const storedUser = localStorage.getItem("game");
    return {
      _id: null,
      roomCode: null,
      participants: [],
      active: false,
      isGameStarted: false,
      questions: [],
      currentQuestionNumber: null,
      questionTime: null,
      owner: null,
    };
  });

  const updateGameState = (newState) => {
    console.log(newState);
    setGameState({ ...gameState, ...newState/*, participants: [
      {
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      },{
        user: {
          _id: "asdsadsa",
          firstName: "asdasdasdas",
          lastName: "asdasdsadsds",
          email: "asdsaddadsdsdsa",
          joinedGame: null,
          createdGame: null,
        },
        score: 0,
        ranking: 0
      }
    ] */});
    localStorage.setItem("game", JSON.stringify(newState));
  };

  const clearGameState = () => {
    setGameState({
      _id: null,
      roomCode: null,
      participants: [],
      active: false,
      isGameStarted: false,
      questions: [],
      owner: null,
      currentQuestionNumber: null,
      questionTime: null,
    });
  };

  return (
    <GameContext.Provider
      value={{ gameState, updateGameState, clearGameState }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
