import {
  Link,
  Outlet,
  RouterProvider,
  BrowserRouter,
  Route,
  Router,
  Navigate,
  redirect,
  Routes,
  useNavigate,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import { ApiProvider } from "./api";
import Navbar from "./components/Navbar";
import AuthStatus from "./components/AuthStatus";
import { socket } from "./socket";
import LoginPage from "./components/LoginPage";
import Input from "./components/Input";
import { useContext, useEffect } from "react";
import CreateRoom from "./components/CreateRoom";
import GameRoom from "./components/GameRoom";
import { useUser } from "./context/userProvider";
import AdminPanel from "./components/AdminPanel";
import { useGame } from "./context/gameProvider";
import Wait from "./components/Wait";
import GameDashboard from "./components/Dashboard";

function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

const loginAction =
  (updateUser) =>
  async ({ request }) => {
    let formData = await request.formData();
    let username = formData.get("nickname");

    console.log(username);
    // Validate our form inputs and return validation errors via useActionData()
    if (!username) {
      return {
        error: "You must provide a username to log in",
      };
    }
    let tmp;
    // Sign in and redirect to the proper destination if successful.
    try {
      console.log("here");
      socket.emit("odaKatil", {
        username,
        odaAdi: "213132",
      });
      tmp = await new Promise((resolve, reject) => {
        socket.on("siralama", (data) => {
          updateUser({
            username,
            ranking: data,
            admin: data === 0,
          });
          resolve({
            username,
            ranking: data,
            admin: data === 0,
          });
        });
      });
      const { user } = userContext;
    } catch (error) {
      console.log(error);
      // Unused as of now but this is how you would handle invalid
      // username/password combinations - just like validating the inputs
      // above
      return {
        error: "Invalid login attempt",
      };
    }

    let redirectTo = tmp.username
      ? tmp.admin
        ? "/admin"
        : "gameroom"
      : "/gameroom";
    console.log(redirectTo);
    return redirect("/");
  };

const roomAction =
  (userContext, gameContext) =>
  async ({ request }) => {
    let formData = await request.formData();
    let roomCode = formData.get("room-code");
    const { user } = userContext;
    // Validate our form inputs and return validation errors via useActionData()
    if (!roomCode) {
      return {
        error: "You must provide a username to log in",
      };
    }

    // Sign in and redirect to the proper destination if successful.
    try {
      socket.emit("odaKatil", {
        username: user.username,
        odaAdi: roomCode,
      });
      socket.on("odaOluştur", (data) => {
        gameContext.updateGameState(data);
      });
    } catch (error) {
      // Unused as of now but this is how you would handle invalid
      // username/password combinations - just like validating the inputs
      // above
      return {
        error: "Invalid login attempt",
      };
    }

    let redirectTo = undefined;
    return redirect(redirectTo || "/admin/panel");
  };

async function loginLoader(user) {
  if (user?.username) {
    if (user.admin) {
      return redirect("/admin");
    }
  }
  console.log(user);
  return null;
}

function PublicPage() {
  return <h3>Public</h3>;
}

function protectedLoader({ request }) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!fakeAuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

export default function App() {
  const userContext = useUser();
  const gameContext = useGame();
  const { user, updateUser } = userContext;
  const { gameState } = gameContext;
  console.log(gameState);
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Navigate
                to={
                  gameState.numberOfQuestion === gameState.questionNumber &&
                  gameState.questionNumber !== null
                    ? "/dashboard"
                    : user.username
                    ? user.admin
                      ? "/admin"
                      : "gameroom"
                    : "/login"
                }
              />
            }
          ></Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/public" component={PublicPage} />
          <Route
            path="/dashboard"
            element={
              user.username === null ? (
                <Navigate to="/login" />
              ) : (
                <GameDashboard />
              )
            }
          />
          <Route
            path="/protected"
            render={() =>
              isAuthenticated ? <ProtectedPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              gameState.currentQuestion !== null ? (
                <AdminPanel />
              ) : (
                <Navigate to={"/create-room"} />
              )
            }
          />
          <Route
            path="/admin/panel"
            element={
              user.username ? (
                user.admin ? (
                  gameState.currentQuestion !== null ? (
                    <AdminPanel />
                  ) : (
                    <Navigate to={"/create-room"} />
                  )
                ) : (
                  <Navigate to={"/wait"} />
                )
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route
            path="/gameroom"
            element={
              user.username ? (
                user.admin ? (
                  gameState.currentQuestion !== null ? (
                    <AdminPanel />
                  ) : (
                    <Navigate to={"/create-room"} />
                  )
                ) : gameState.currentQuestion === null ? (
                  <Navigate to={"/wait"} />
                ) : (
                  <GameRoom />
                )
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route
            path="/wait"
            element={
              gameState.currentQuestion !== null ? (
                <Navigate to={"/gameroom"} />
              ) : (
                <Wait />
              )
            }
          />
          <Route
            path="/logout"
            render={() => {
              fakeAuthProvider.signout();
              return <Navigate to="/" />;
            }}
          />
          <Route
            path="*"
            element={
              <Navigate
                to={
                  !user.username
                    ? "/login"
                    : user.admin
                    ? "/admin"
                    : "/gameroom"
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
