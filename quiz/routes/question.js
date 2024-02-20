const express = require("express");

const socketServer = require("../socket-connection")();
const bcrypt = require("bcrypt");

const { ensureSession, ensureAdmin } = require("./middleware");
const Game = require("../models/game.model");
const User = require("../models/user.model");
const Question = require("../models/question.model");
const router = express.Router();

router.post("/create_question/:id", ensureSession, async (req, res) => {
  try {
    const gameId = req.params.id;
    const user = await User.findOne({
      _id: req.user._id,
    });

    if (user.createdGame.toString() !== gameId)
      throw new Error(
        "You are not authorized to create question for this game"
      );

    const { question, options, correctAnswerIndex } = req.body;

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer: bcrypt.hashSync(options[correctAnswerIndex], 10),
    });

    const game = await Game.findOneAndUpdate(
      {
        _id: gameId,
      },
      {
        $push: {
          questions: newQuestion,
        },
      },
      { new: true }
    ).populate({
      path: "questions",
    });
    return res.status(200).json(game);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ message: typeof e === "string" ? e : "Question not created!!" });
  }
});

router.post(
  "/update_question/:id/game/:gameId",
  ensureSession,
  async (req, res) => {
    try {
      const gameId = req.params.gameId;
      const questionId = req.params.id;
      const user = await User.findOne({
        _id: req.user._id,
      });

      if (user.createdGame.toString() !== gameId)
        throw new Error(
          "You are not authorized to update question for this game"
        );

      const { question, options, correctAnswerIndex } = req.body;

      const updatedQuestion = await Question.findOneAndUpdate(
        {
          _id: questionId,
        },
        {
          question,
          options,
          correctAnswer: bcrypt.hashSync(options[correctAnswerIndex], 10),
        },
        { new: true }
      );
      return res.status(200).json(updatedQuestion);
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: typeof e === "string" ? e : "Question not updated!!",
      });
    }
  }
);

router.delete(
  "/delete_question/:id/game/:gameId",
  ensureSession,
  async (req, res) => {
    try {
      const gameId = req.params.gameId;
      const questionId = req.params.id;
      const user = await User.findOne({
        _id: req.user._id,
      });

      if (user.createdGame.toString() !== gameId)
        throw new Error(
          "You are not authorized to delete question for this game"
        );

      await Game.findOneAndUpdate(
        {
          _id: gameId,
        },
        {
          $pull: {
            questions: questionId,
          },
        }
      );
      await Question.deleteOne({
        _id: questionId,
      });
      return res.status(200).json({ message: "Question is deleted" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        message: typeof e === "string" ? e : "Question not deleted!!",
      });
    }
  }
);

module.exports = router;
