const express = require("express");
const Game = require("../models/game.model");
const User = require("../models/user.model");
const RoomCode = require("../models/roomCode.model");
const socketServer = require("../socket-connection")();
const bcrypt = require("bcrypt");

const {
  ensureSession,
  ensureAdmin,
  signupReturnData,
  filterUser,
} = require("./middleware");

const router = express.Router();

router.post("/join_room/:id", ensureSession, async (req, res) => {
  try {
    const gameId = req.params.id;

    const game = await Game.findOneAndUpdate(
      {
        roomCode: gameId,
        isGameStarted: false,
      },
      {
        $push: {
          participants: { user: req.user._id },
        },
      },
      { upsert: true, new: true }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        joinedGame: game._id,
      },
      { new: true }
    );
    socketServer.emit("new person", game);
    return res.status(200).json({
      game,
      ranking: game.participants.length + 1,
      user: filterUser(user),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/create_game", ensureSession, async (req, res) => {
  try {
    const roomCodeList = await RoomCode.find({
      isFree: false,
    });
    const randomRoomCodeIndex = Math.floor(
      Math.random() * (roomCodeList.length - 1)
    );
    console.log(randomRoomCodeIndex);
    const game = await Game.create({
      roomCode: roomCodeList[randomRoomCodeIndex].code,
      active: true,
      owner: req.user._id,
    });

    await RoomCode.findByIdAndUpdate(roomCodeList[randomRoomCodeIndex]._id, {
      isFree: false,
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        createdGame: game._id,
      },
      { new: true }
    );

    return res.status(200).json({
      game,
      user: filterUser(user),
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: e,
    });
  }
});

router.get("/game/:id", ensureSession, async (req, res) => {
  try {
    const gameId = req.params.id;

    const game = await Game.findOne({
      _id: gameId,
    });

    return res.status(200).json(game);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Game not found!!" });
  }
});

router.post("/next_question/:id", ensureSession, async (req, res) => {
  try {
    const { currentQuestionNumber } = req.body;
    const gameId = req.params.id;
    const game = await Game.findOneAndUpdate(
      {
        _id: gameId,
      },
      {
        isGameStarted: true,
        currentQuestionNumber: currentQuestionNumber + 1,
        $set: { "participants.$[].answered": false },
        questionTime: new Date(),
      },
      { new: true }
    );

    // Emit the next question event
    socketServer.emit("next question", game);

    // Listen for answers via socket

    let interval = setInterval(async () => {
      const game = await Game.findOneAndUpdate(
        {
          _id: gameId,
        },
        {
          isGameStarted: true,
          currentQuestionNumber: currentQuestionNumber + 1,
          $set: { "participants.$[].answered": false },
          questionTime: null,
        },
        { new: true }
      );
      game.participants = game.participants.sort((a, b) => b.score - a.score);
      await game.save();
      socketServer.emit("get updated gamestate", game);
      socketServer.emit("timeout");
      clearInterval(interval);
    }, 35000);

    return res.status(200).json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

router.post("/answer_question/:id", async (req, res) => {
  try {
    console.log("*******************");
    const { answer } = req.body;
    const userId = req.user._id;
    const gameId = req.params.id;
    // Your answer processing logic here
    // Calculate score, update participant, emit score updates, etc.
    const game = await Game.findOne({
      _id: gameId,
    });
    const participant = game.participants.find((item) => {
      return item.user._id.toString() === userId.toString();
    });
    console.log(participant);
    let updatedGame;
    if (participant) {
      // Calculate score based on the provided logic
      let score = 0;
      if (participant && participant.answered === false) {
        const question = game.questions[game.currentQuestionNumber - 1];
        if (answer && bcrypt.compareSync(answer, question.correctAnswer)) {
          score += 600 + (600 * participant.strikeCount) / 3;
          //score += 100 * participant.strikeCount;
          const isFirstAnswer = !game.participants.some(
            (p) => p.answered === false && p.user._id !== userId
          );

          if (isFirstAnswer) {
            score += 50;
          }
          participant.strikeCount++;
        } else participant.strikeCount = 0;

        // Check if this is the first person to answer

        // Update the participant's score
        participant.score += score;
        participant.answered = true;

        updatedGame = await Game.findOneAndUpdate(
          {
            _id: game._id,
          },
          {
            $set: { "participants.$[player]": participant },
          },
          {
            arrayFilters: [{ "player.user": userId }],
            new: true,
          }
        );
        console.log(
          answer,
          updatedGame.participants,
          question.correctAnswer,
          bcrypt.compareSync(answer, question.correctAnswer),
          participant
        );
        // Save the updated game
        //await game.save();

        // Emit an event to update the frontend with the new scores
      }
      // Emit an event to update the frontend with the new scores
    }
    console.log("*******************");

    if (!updatedGame) throw new Error("ERROR during answer question");
    return res.status(200).json({
      message: "Successfully answered!",
    });
  } catch (e) {
    console.log(e);

    return res.status(405).json({
      message: e,
    });
  }
});

router.get("/gamestate/:id", ensureAdmin, async (req, res) => {
  try {
    const gameId = req.params.id;
    const { roomCode, isGameStarted, currentQuestionNumber } = req.body;
    /*const game = await Game.findOneAndUpdate(
      {
        code: roomCode,
      },
      {
        active: true,
        currentQuestionNumber: currentQuestionNumber + 1,
      },
      { new: true } // Ensure you get the updated document
    );*/
    const game = await Game.findById(gameId);

    socketServer.emit("get ranking", {
      ranking: game.participants
        .sort((a, b) => a.score - b.score)
        .map((item) => item.user._id.toString())
        .indexOf(req.user._id.toString()),
    });
    game.questionTime = null;
    game.currentQuestion = null;
    await game.save();
    socketServer.emit("update gameroom", game);
    return res.status(200).json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
