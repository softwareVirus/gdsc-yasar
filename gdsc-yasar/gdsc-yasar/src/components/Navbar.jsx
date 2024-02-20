import React, { Fragment, useState } from "react";
import logo from "../assets/logo-removebg-preview 1.png";
import "../style/Navbar.css";
import { Link } from "react-router-dom";
import { useUser } from "../context/userProvider";
import axios from "axios";
import { useGame } from "../context/gameProvider";
const Navbar = () => {
  const { user, clearUser } = useUser();
  const { gameState, updateGameState, clearGameState } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  console.log(
    gameState.room,
    gameState.owner,
    user._id,
    gameState.owner == user._id
  );
  return (
    <div className="navbar-container">
      <div className="navbar-box">
        <div className="navbar-logo">
          <img src={logo} alt="logo" />
          <h3>GDSC YASAR</h3>
        </div>
        <div className="navbar-links desktop" style={{ gap: "2.5rem" }}>
          {gameState.roomCode && gameState.owner == user._id ? (
            <Fragment>
              <Link to={"/admin/panel"}>Game Panel</Link>
              <Link to={"/admin/create_questions"}>Create Questions</Link>
            </Fragment>
          ) : (
            <Fragment>
              <Link to={"/admin/create_room"}>Create Game</Link>
              <Link to={"/user/join_room"}>Join Game</Link>
            </Fragment>
          )}
        </div>
        <div className="navbar-links desktop">
          <Fragment>
            {user._id ? (
              <Link
                to={"/"}
                onClick={async () => {
                  await axios.post("/auth/logout");
                  clearUser();
                  clearGameState();
                }}
              >
                Logout
              </Link>
            ) : (
              <Fragment>
                <Link to={"/login"}>Login</Link>
                <Link to={"/signup"}>Signup</Link>
              </Fragment>
            )}
          </Fragment>
        </div>
        <div
          className="hamburger-menu"
          style={{ cursor: "pointer" }}
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M 2 5 L 2 7 L 22 7 L 22 5 L 2 5 z M 2 11 L 2 13 L 22 13 L 22 11 L 2 11 z M 2 17 L 2 19 L 22 19 L 22 17 L 2 17 z"></path>
          </svg>
        </div>
        {isOpen && (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              background: "white",
              top: 0,
              left: 0,
            }}
          >
            <div className="navbar-box" style={{ padding: "0.75rem" }}>
              <div className="navbar-logo" style={{ margin: 0, marginLeft: 0 }}>
                <img src={logo} alt="logo" />
                <h3>GDSC YASAR</h3>
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 50 50"
                >
                  <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                </svg>
              </div>
            </div>
            <div
              className="navbar-links"
              style={{
                gap: "0.75rem",
                padding: "1.75rem 0.75rem",
                flexDirection: "column",
              }}
            >
              {gameState.roomCode && gameState.owner == user._id ? (
                <Fragment>
                  <Link to={"/admin/panel"}>Game Panel</Link>
                  <Link to={"/admin/create_questions"}>Create Questions</Link>
                </Fragment>
              ) : (
                <Fragment>
                  <Link to={"/admin/create_room"}>Create Game</Link>
                  <Link to={"/user/join_room"}>Join Game</Link>
                </Fragment>
              )}
              <Fragment>
                {user._id ? (
                  <Link
                    to={"/"}
                    onClick={async () => {
                      await axios.post("/auth/logout");
                      clearUser();
                      clearGameState();
                    }}
                  >
                    Logout
                  </Link>
                ) : (
                  <Fragment>
                    <Link to={"/login"}>Login</Link>
                    <Link to={"/signup"}>Signup</Link>
                  </Fragment>
                )}
              </Fragment>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/*
<div className="navbar-links" style={{ gap: "2.5rem" }}>
          {gameState.roomCode && gameState.owner == user._id ? (
            <Fragment>
              <Link to={"/admin/panel"}>Game Panel</Link>
              <Link to={"/admin/create_questions"}>Create Questions</Link>
            </Fragment>
          ) : (
            <Fragment>
              <Link to={"/admin/create_room"}>Create Game</Link>
              <Link to={"/user/join_room"}>Join Game</Link>
            </Fragment>
          )}
        </div>
        <div className="navbar-links">
          <Fragment>
            {user._id ? (
              <Link to={"/"} onClick={async () => {
                await axios.post("/auth/logout");
                clearUser()
                clearGameState()
              }}>Logout</Link>
            ) : (
              <Fragment>
                <Link to={"/login"}>Login</Link>
                <Link to={"/signup"}>Signup</Link>
              </Fragment>
            )}
          </Fragment>
        </div>

<Fragment>
            <div
              onClick={async () => {
                await axios.post("/auth/logout");
                clearUser();
              }}
            >
              Logout
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <Link to={"/login"}>Login</Link>
            <Link to={"/signup"}>Signup</Link>
          </Fragment> */

export default Navbar;
