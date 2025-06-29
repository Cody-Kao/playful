import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SpotifyPlayerContextProvider from "./context/PlayerContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SpotifyPlayerContextProvider>
      <App />
    </SpotifyPlayerContextProvider>
  </React.StrictMode>,
);
