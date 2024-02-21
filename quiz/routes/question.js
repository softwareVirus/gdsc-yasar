const express = require("express");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const router = express.Router();

// Reference to Firestore collections
const gamesCollection = admin.firestore().collection("games");
const usersCollection = admin.firestore().collection("users");
const questionsCollection = admin.firestore().collection("questions");

router.post("/create_question/:id", async (req, res) => {
  try {
    const gameId = req.params.id;
    const userId = req.user.uid;

    const userDoc = await usersCollection.doc(userId).get();
    const userData = userDoc.data();
    if (userData.createdGame !== gameId) {
      throw new Error("You are not authorized to create a question for this game");
    }

    const { question, options, correctAnswerIndex } = req.body;

    const correctAnswer = options[correctAnswerIndex];
    const hashedCorrectAnswer = await bcrypt.hash(correctAnswer, saltRounds);

    const newQuestionDoc = await questionsCollection.add({
      question,
      options,
      correctAnswer: hashedCorrectAnswer,
    });

    const gameDoc = await gamesCollection.doc(gameId).get();
    const gameData = gameDoc.data();
    gameData.questions.push(newQuestionDoc.id);
    await gamesCollection.doc(gameId).update({ questions: gameData.questions });

    return res.status(200).json({ message: "Question created successfully" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e.message || "Question not created" });
  }
});

router.post("/update_question/:id/game/:gameId", async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const questionId = req.params.id;
    const userId = req.user.uid;

    const userDoc = await usersCollection.doc(userId).get();
    const userData = userDoc.data();
    if (userData.createdGame !== gameId) {
      throw new Error("You are not authorized to update a question for this game");
    }

    const { question, options, correctAnswerIndex } = req.body;

    const correctAnswer = options[correctAnswerIndex];
    const hashedCorrectAnswer = await bcrypt.hash(correctAnswer, saltRounds);

    await questionsCollection.doc(questionId).update({
      question,
      options,
      correctAnswer: hashedCorrectAnswer,
    });

    return res.status(200).json({ message: "Question updated successfully" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e.message || "Question not updated" });
  }
});

router.delete("/delete_question/:id/game/:gameId", async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const questionId = req.params.id;
    const userId = req.user.uid;

    const userDoc = await usersCollection.doc(userId).get();
    const userData = userDoc.data();
    if (userData.createdGame !== gameId) {
      throw new Error("You are not authorized to delete a question for this game");
    }

    await questionsCollection.doc(questionId).delete();

    const gameDoc = await gamesCollection.doc(gameId).get();
    const gameData = gameDoc.data();
    const updatedQuestions = gameData.questions.filter(q => q !== questionId);
    await gamesCollection.doc(gameId).update({ questions: updatedQuestions });

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e.message || "Question not deleted" });
  }
});

module.exports = router;
