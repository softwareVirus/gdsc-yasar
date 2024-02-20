import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserContextProvider, { useUser } from "./context/userProvider";
import GameContextProvider from "./context/gameProvider";
import ErrorContextProvider from "./context/errorProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <GameContextProvider>
        <ErrorContextProvider>
          <Suspense fallback={<>...</>}>
            <App />
          </Suspense>
        </ErrorContextProvider>
      </GameContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
