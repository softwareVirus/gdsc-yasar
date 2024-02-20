import React, { useContext } from "react";
import { useGame } from "../context/gameProvider";
import DashboardUserCard from "./DashboardUserCard";
import { Fragment } from "react";
import { useUser } from "../context/userProvider";

function GameDashboard() {
  const { gameState } = useGame();
  const { user } = useUser();
  const headers = ["ranking", "name", "score"];
  console.log(gameState);
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    maxHeight: "calc(100% - 64px)", // Set the maximum height
    overflow: "auto", // Enable scrolling when content overflows
  };

  const thStyle = {
    backgroundColor: "#f2f2f2",
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
  };
  const rankingContainerStyle = {
    display: "flex",
    marginTop: "7rem",
    flexDirection: "column",
    alignItems: "center",
  };

  const rankingStyle = {
    border: "2px solid #4285F4", // Blue
    borderRadius: "8px",
    padding: "15px",
    margin: "10px",
    width: "95%",
    boxSizing: "border-box",
    textAlign: "center",
    background: "white", // White background
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };
  const userRank = gameState.participants
    .sort((a, b) => b.score - a.score)
    .map((item) => item.user._id)
    .indexOf(user._id);

  return (
    <Fragment>
      <div>
        <div style={rankingContainerStyle}>
          <div style={{ ...rankingStyle }}>
            <p
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Rank: {userRank + 1}
            </p>
            <p style={{ fontSize: "1.1em", color: "#2c3e50" }}>
              Name: {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default GameDashboard;
