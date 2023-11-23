import React, { useState } from "react";
import { nanoid } from "nanoid";
import { useGame } from "../context/gameProvider";
const QuestionList = ({
  listQuestion,
  selectedQuestion,
  setUpdateQuestion,
  setSelectedQuestion,
}) => {
  const { gameState, updateGameState } = useGame();
  console.log(gameState)
  const handleDeleteQuestion = (index) => {
    let copyArray = [...listQuestion];
    copyArray.splice(index, 1);
    updateGameState({
      ...gameState,
      questions: copyArray,
    });
  };
  return (
    <div className="admin-question-list-container">
      <div className="admin-question-list-box">
        {gameState.questions && gameState.questions.length > 0 ? (
          gameState.questions.map((item, index) => {
            return (
              <div
                className={
                  "admin-question-box" +
                  (index === selectedQuestion ? " selected-question-box" : "")
                }
                key={nanoid()}
              >
                <h1 style={{ textAlign: "left", width: "100%" }}>{`Question ${
                  index + 1
                }`}</h1>
                <p className="admin-question-content">{item.question}</p>
                <div className="admin-question-box-button-container">
                  <button
                    className="admin-expand-question-button"
                    onClick={() => {
                      setSelectedQuestion(index);
                      setUpdateQuestion(false);
                    }}
                  >
                    Display
                  </button>
                  <button
                    className="admin-expand-question-button gdsc-green"
                    onClick={() => {
                      setSelectedQuestion(index);
                      setUpdateQuestion(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="admin-expand-question-button warning-color"
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-question-info">
            <h3>There is no question!!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
