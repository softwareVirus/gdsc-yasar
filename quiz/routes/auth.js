const express = require("express");
const firebaseAdmin = require("firebase-admin");
const router = express.Router();

// Initialize Firestore
const firestore = firebaseAdmin.firestore();

router.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Store session data in Express session
    req.session.uid = uid;

    res.status(200).send({ uid });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(400).send("Login failed");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Create user in Firebase Authentication
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store additional user data in Firestore
    const userData = {
      firstName,
      lastName,
      email,
      joinedGame: null,
      createdGame: null,
    };
    await firestore.collection("users").doc(userRecord.uid).set(userData);

    // Store session data in Express session
    req.session.uid = userRecord.uid;

    res.status(200).send(userRecord);
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(400).send("Signup failed");
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Clear session data in Express session
    req.session.destroy();

    res.status(200).send("Logout successful");
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).send("Logout failed");
  }
});

router.get("/session", async (req, res) => {
  try {
    const uid = req.session.uid;
    if (!uid) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Retrieve user data from Firestore
    const userDoc = await firestore.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract user data
    const userData = userDoc.data();
    const { firstName, lastName, email } = userData;

    // Return session data containing first name, last name, and email
    res.status(200).json({ firstName, lastName, email });
  } catch (error) {
    console.error("Error retrieving session data:", error);
    res.status(500).send("Failed to retrieve session data");
  }
});

module.exports = router;
