import React, { Fragment } from "react";
import logo from "../assets/logo-removebg-preview 1.png";
import "../style/Navbar.css";
import { Link } from "react-router-dom";
import { useUser } from "../context/userProvider";
import axios from "axios";
import { useGame } from "../context/gameProvider";
const Navbar = () => {
  const { user, clearUser } = useUser();
  const { gameState, updateGameState } = useGame();
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
              <Link to={"/auth/logout"}>Logout</Link>
            ) : (
              <Fragment>
                <Link to={"/login"}>Login</Link>
                <Link to={"/signup"}>Signup</Link>
              </Fragment>
            )}
          </Fragment>
        </div>
      </div>
    </div>
  );
};

/*<Fragment>
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
