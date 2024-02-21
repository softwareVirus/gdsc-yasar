# Quiz App Documentation

## Table of Contents

1. [Installation](#installation)
2. [Description](#description)
3. [Routes](#routes)
4. [Middleware](#middleware)
5. [Environment Variables](#environment-variables)
6. [Firebase Configuration](#firebase-configuration)

## 1. Installation <a name="installation"></a>

To set up the quiz app server-side code, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `npm install` for server and client side.
3. Configure the Firebase Admin SDK with your service account key in server foder.
4. Set up environment variables if necessary.
5. Start the server using `npx nodemon` and start client with `npm run dev`.

## 2. Description <a name="description"></a>

The quiz app server-side code is built using Node.js and Express.js. It utilizes Firebase for authentication and Firestore for database management. Socket.io is used for real-time communication between the server and clients.

## 3. Routes <a name="routes"></a>

### Auth Routes (`/auth`)

- `/login`: Handles user login.
- `/signup`: Handles user signup.
- `/logout`: Handles user logout.
- `/session`: Retrieves user session data.

### Game Routes (`/game`)

- `/join_room/:id`: Allows users to join a game room.
- `/create_game`: Creates a new game.
- `/game/:id`: Retrieves game data.
- `/next_question/:id`: Starts the next question in a game.
- `/answer_question/:id`: Submits an answer to a question.
- `/gamestate/:id`: Retrieves the game state.

### Question Routes (`/question`)

- `/create_question/:id`: Creates a new question for a game.
- `/update_question/:id/game/:gameId`: Updates a question for a game.
- `/delete_question/:id/game/:gameId`: Deletes a question from a game.

## 4. Middleware <a name="middleware"></a>

### ensureSession

- Ensures that the user has an active session.

### ensureAdmin

- Ensures that the user is an admin.

## 5. Environment Variables <a name="environment-variables"></a>

- If using environment variables, set them in a `.env` file.
- Required variables:
  - `PORT`: Port number for the server.
  - Other Firebase configuration variables if not hardcoded.

## 6. Firebase Configuration <a name="firebase-configuration"></a>

- The Firebase Admin SDK is initialized with the service account key.
- If environment variables are not used, Firebase configuration details should be directly included in the `server.js` file.
