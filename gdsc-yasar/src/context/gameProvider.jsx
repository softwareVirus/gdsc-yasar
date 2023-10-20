import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

export const useGame = () => {
  return useContext(GameContext);
};

const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = useState(() => {
    // Initialize the user state from local storage if available
    const storedUser = localStorage.getItem("game");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          room: null,
          dashboard: [],
          numberOfQuestions: 15,
          currentQuestion: null,
          hashkey: null,
          questionNumber: 0,
          answer: 2
        };
  });

  const updateGameState = (newState) => {
    console.log(newState)
    setGameState({ ...gameState, ...newState });
    localStorage.setItem("game", JSON.stringify(newState));
  };

  const clearGameState = () => {
    setGameState({
      room: null,
      dashboard: [],
      numberOfQuestions: null,
      currentQuestion: null,
      hashkey: null,
      questionNumber: 0,
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
