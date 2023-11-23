import React, { useState } from "react";
import SearchQuestion from "./SearchQuestion";
import QuestionList from "./QuestionList";
import Question from "./Question";
import { useGame } from "../context/gameProvider";

const CreateQuestion = () => {
  const { gameState } = useGame();
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [updateQuestion, setUpdateQuestion] = useState(false);

  return (
    <div>
      <div className="display-question-header">
        <SearchQuestion />
        <button
          className="admin-expand-question-button"
          onClick={() => {
            setUpdateQuestion(false);
            setSelectedQuestion(gameState.questions.length);
          }}
        >
          Add New Question
        </button>
      </div>
      <div className="display-question-hero">
        <QuestionList
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          listQuestion={/*gameState.gameState.questions*/ gameState.questions}
          setUpdateQuestion={setUpdateQuestion}
        />
        <Question
          length={gameState.questions.length}
          updateQuestion={updateQuestion}
          setUpdateQuestion={setUpdateQuestion}
          selectedQuestion={selectedQuestion}
          correctAnswer={
            gameState.questions[selectedQuestion]?.correctAnswer
          }
          question={
            gameState.questions[selectedQuestion]?.question
            /*
            gameState.gameState.questions ? gameState.gameState.questions[0]?.question : undefined*/
          }
          options={
            gameState.questions[selectedQuestion]?.options
            /*gameState.gameState.questions ? gameState.gameState.questions[0]?.options : undefined*/
          }
        />
      </div>
    </div>
  );
};

export default CreateQuestion;
