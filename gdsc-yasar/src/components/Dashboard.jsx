import React, { useContext } from "react";
import { useGame } from "../context/gameProvider";

function GameDashboard() {
  const { gameState } = useGame();
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

  const tdStyle = {
    backgroundColor: "#f2f2f2",
    border: "1px solid #f2f2f2",
    textAlign: "left",
    padding: "8px",
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={thStyle}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gameState.dashboard.map((item, index) => (
            <tr key={index + "asdasdasda"} style={tdStyle}>
              {Object.keys(item)
                .filter((item) =>
                  ["ranking", "kullaniciAdi", "puan"].includes(item)
                )
                .sort(
                  (a, b) =>
                    ["ranking", "kullaniciAdi", "puan"].indexOf(a) -
                    ["ranking", "kullaniciAdi", "puan"].indexOf(b)
                )
                .map((header, i) => (
                  <td key={header + "indexasdadadas"} style={tdStyle}>
                    {item[header]}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GameDashboard;
