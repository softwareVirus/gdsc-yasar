import { nanoid } from "nanoid";
import React, { Fragment, useEffect, useState } from "react";
import { useGame } from "../context/gameProvider";
import bcrypt from "../utils/bcrypt";
import axios from "axios";

function getCorrectAnswerIndex(game, index, answer) {
  let correctIndex = 0;
  game.questions[index].options.forEach((item, index) => {
    if (bcrypt.compareSync(item.toString(), answer)) {
      correctIndex = index;
    }
  });
  return correctIndex;
}

const CreateQuestionForm = ({
  selectedQuestion,
  length,
  type,
  question,
  setQuestions,
  options,
  correctAnswer,
  setUpdateQuestion,
}) => {
  const { gameState, updateGameState } = useGame();
  const [questionOrder, setQuestionOrder] = useState(selectedQuestion + 1);
  const [newQuestion, setNewQuestion] = useState(question ? question : "");
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(
    correctAnswer
      ? getCorrectAnswerIndex(gameState, selectedQuestion, correctAnswer)
      : 0
  );
  const [newOptions, setNewOptions] = useState(
    options ? options : ["", "", "", ""]
  );

  const handleQuestionOrder = (e) => {
    if (Number(e.target.value) >= 1 && Number(e.target.value) <= length + 1)
      setQuestionOrder(e.target.value);
  };
  console.log(newOptions);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateQuestion(false);
    try {
      if (type != "update") {
        const game = await axios.post(
          "/question/create_question/" + gameState._id,
          {
            question: newQuestion,
            options: newOptions,
            correctAnswerIndex: newCorrectAnswer,
          }
        );
        console.log(game.data);
        updateGameState(game.data);
      } else {
        const updatedQuestion = await axios.post(
          `question/update_question/${gameState.questions[selectedQuestion]._id}/game/${gameState._id}`,
          {
            question: newQuestion,
            options: newOptions,
            correctAnswerIndex: newCorrectAnswer,
          }
        );
        let copyArray = [...gameState.questions];
        copyArray.splice(selectedQuestion, 1);
        copyArray = copyArray
          .slice(0, questionOrder - 1)
          .concat(updatedQuestion.data)
          .concat(copyArray.slice(questionOrder - 1, copyArray.length));
        updateGameState({
          ...gameState,
          questions: copyArray,
        });
      }
    } catch (e) {}
  };
  return (
    <form onSubmit={handleSubmit} className="question-display-container">
      <div className="form-input-container cancel-radius">
        <input
          placeholder="Question order"
          type="number"
          min={1}
          max={length + 1}
          value={questionOrder}
          onChange={handleQuestionOrder}
        />
      </div>
      <div className="form-input-container cancel-radius">
        <textarea
          required={true}
          className="question-create-box update"
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
      </div>
      <div className="form-input-container cancel-radius">
        <input
          required={true}
          placeholder="Option 1"
          value={newOptions[0]}
          onChange={(e) =>
            setNewOptions((prev) => {
              let copyArray = [...prev];
              copyArray[0] = e.target.value;
              return copyArray;
            })
          }
        />
      </div>
      <div className="form-input-container cancel-radius">
        <input
          required={true}
          placeholder="Option 2"
          value={newOptions[1]}
          onChange={(e) =>
            setNewOptions((prev) => {
              let copyArray = [...prev];
              copyArray[1] = e.target.value;
              return copyArray;
            })
          }
        />
      </div>
      <div className="form-input-container cancel-radius">
        <input
          required={true}
          placeholder="Option 3"
          value={newOptions[2]}
          onChange={(e) =>
            setNewOptions((prev) => {
              let copyArray = [...prev];
              copyArray[2] = e.target.value;
              return copyArray;
            })
          }
        />
      </div>
      <div className="form-input-container cancel-radius">
        <input
          required={true}
          placeholder="Option 4"
          value={newOptions[3]}
          onChange={(e) =>
            setNewOptions((prev) => {
              let copyArray = [...prev];
              copyArray[3] = e.target.value;
              return copyArray;
            })
          }
        />
      </div>
      <div className="form-input-container cancel-radius">
        <input
          required={true}
          placeholder="Correct Option Number"
          type="number"
          min={1}
          max={4}
          value={newCorrectAnswer + 1}
          onChange={(e) => {
            if (Number(e.target.value) >= 1 && Number(e.target.value) <= 4) {
              console.log(e.target.value);
              setNewCorrectAnswer(e.target.value - 1);
            }
          }}
        />
      </div>
      <button className="admin-expand-question-button" type="submit">
        {type == "update" ? "Save Question" : "Add Question"}
      </button>
    </form>
  );
};

const DisplayQuestion = React.memo(({ question, options, correctAnswer }) => {
  const { gameState } = useGame();
  return (
    <div className="create-question question-display-container">
      <div className="question-box">
        <div className="question-context">{question}</div>
      </div>
      <div className="options-container">
        {options.map((item, index) => {
          return (
            <div
              className={
                "display-option option" +
                (bcrypt.compareSync(item.toString(), correctAnswer)
                  ? " correct-answer"
                  : "")
              }
              key={index + "?" + item}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
});
const Question = ({
  question,
  options,
  updateQuestion,
  setUpdateQuestion,
  selectedQuestion,
  correctAnswer,
  length,
}) => {
  return (
    <Fragment>
      {question && !updateQuestion ? (
        <DisplayQuestion
          question={question}
          options={options}
          correctAnswer={correctAnswer}
        />
      ) : question ? (
        <CreateQuestionForm
          selectedQuestion={selectedQuestion}
          length={length}
          question={question}
          options={options}
          setUpdateQuestion={setUpdateQuestion}
          correctAnswer={correctAnswer}
          type={"update"}
          key={nanoid()}
        />
      ) : (
        <CreateQuestionForm
          correctAnswer={correctAnswer}
          selectedQuestion={selectedQuestion}
          setUpdateQuestion={setUpdateQuestion}
          length={length}
          type={"create"}
          key={nanoid()}
        />
      )}
    </Fragment>
  );
};
export default Question;
