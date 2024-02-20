import {
  Outlet,
  BrowserRouter,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { socket } from "./socket";
import LoginPage from "./components/LoginPage";
import { Suspense, useEffect } from "react";
import CreateRoom from "./components/CreateRoom";
import GameRoom from "./components/GameRoom";
import { useUser } from "./context/userProvider";
import AdminPanel from "./components/AdminPanel";
import { useGame } from "./context/gameProvider";
import Wait from "./components/Wait";
import CreateQuestion from "./components/CreateQuestion";
import axios from "axios";
import SignupPage from "./components/SignupPage";
import PaintColor from "./components/PaintColor";
import { redirectLocation } from "./utils/routerHelper";
import JoinRoom from "./components/JoinRoom";
import { useError } from "./context/errorProvider";
import ErrorBox from "./components/ErrorBox";
import GameDashboard from "./components/Dashboard";
axios.defaults.baseURL = "http://localhost:3005";
axios.defaults.withCredentials = true;

function Navigater() {
  const { user } = useUser();
  const { gameState } = useGame();
  const { error } = useError();
  return <Navigate to={redirectLocation(user, gameState)} />;
}

export default function App() {
  const userContext = useUser();
  const gameContext = useGame();
  const { user, updateUser } = userContext;
  const { gameState, updateGameState } = gameContext;
  console.log(user);
  console.log(gameState);

  useEffect(() => {
    if (user._id == null) return;
    /*if(user.joinedGame) {
      const game
    }*/
  }, [user]);

  useEffect(() => {
    async function main() {
      const userResponse = await axios.get("/auth/session");
      console.log(userResponse.data);
      if (userResponse.data.joinedGame) {
        const response = await axios.get(
          "/game/game/" + userResponse.data.joinedGame
        );
        updateGameState(response.data);
      }
      if (userResponse.data.createdGame) {
        const response = await axios.get(
          "/game/game/" + userResponse.data.createdGame
        );
        updateGameState(response.data);
      }
      updateUser(userResponse.data);
    }
    main();
    socket.on("update gameroom", (data) => {
      updateGameState(data);
    });
    return () => {
      socket.off("update gameroom");
    };
  }, []);
  return (
    <div className="bg-google">
      <PaintColor color={"#EA4436"} className={"paint-color top-left"} />
      <PaintColor color={"#4485F3"} className={"paint-color bottom-left"} />
      <PaintColor color={"#FBBC0A"} className={"paint-color bottom-right"} />
      <PaintColor color={"#139D59"} className={"paint-color top-right"} />
      <BrowserRouter>
        <Navbar />
        <div style={{ position: "absolute", top: "4rem", width: "100%" }}>
          <Routes>
            <Route exact path="/" element={<Navigater />} />
            <Route
              path="login"
              element={!user._id ? <LoginPage /> : <Navigater />}
            />
            <Route
              path="signup"
              element={!user._id ? <SignupPage /> : <Navigater />}
            />
            <Route path="user" element={<Outlet />}>
              <Route
                path="join_room"
                element={
                  user.email && !gameState.roomCode ? (
                    <JoinRoom />
                  ) : (
                    <Navigater />
                  )
                }
              />
              <Route
                path="game_room"
                element={
                  user.email &&
                  gameState.roomCode &&
                  gameState.questionTime &&
                  gameState.currentQuestionNumber <=
                    gameState.questions.length ? (
                    <GameRoom />
                  ) : (
                    <Navigater />
                  )
                }
              />
              <Route
                path="wait"
                element={
                  user.email &&
                  gameState.roomCode &&
                  !gameState.questionTime &&
                  gameState.currentQuestionNumber >
                    gameState.questions.length ? (
                    <GameDashboard />
                  ) : user.email &&
                    gameState.roomCode &&
                    !gameState.questionTime &&
                    gameState.currentQuestionNumber <=
                      gameState.questions.length ? (
                    <Wait />
                  ) : (
                    <Navigater />
                  )
                }
              />
            </Route>
            <Route path="admin" element={<Outlet />}>
              <Route
                path="create_room"
                element={
                  user.email && !gameState.roomCode ? (
                    <CreateRoom />
                  ) : (
                    <Navigater />
                  )
                }
              />
              <Route
                path="panel"
                element={
                  user.email &&
                  user._id === gameState.owner &&
                  gameState.roomCode ? (
                    <AdminPanel />
                  ) : (
                    <Navigater />
                  )
                }
              />
              <Route
                path="create_questions"
                element={
                  user.email && gameState.roomCode ? (
                    <CreateQuestion />
                  ) : (
                    <Navigater />
                  )
                }
              />
            </Route>
          </Routes>
        </div>
        <ErrorBox />
      </BrowserRouter>
    </div>
  );
}
