import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserContextProvider, { useUser } from "./context/userProvider";
import GameContextProvider from "./context/gameProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <GameContextProvider>
        <App />
      </GameContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
