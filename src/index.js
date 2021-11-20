import React from "react";
import ReactDOM from "react-dom";
import IndexedDBProvider from "use-indexeddb";
import "./styles/index.css";
import App from "./App";

const idbConfig = {
  databaseName: "poge",
  version: 1,
  stores: [
    {
      name: "favourites",
      id: { keyPath: "id", autoIncrement: true },
      indices: [
        { name: "title", keyPath: "title" },
        { name: "thumb", keyPath: "thumb" },
        { name: "image", keyPath: "image", options: { unique: true } },
        { name: "url", keyPath: "url", options: { unique: true } },
        { name: "subreddit", keyPath: "subreddit" },
        { name: "type", keyPath: "type" },
      ],
    },
  ],
};

ReactDOM.render(
  <React.StrictMode>
    <IndexedDBProvider config={idbConfig}>
      <App />
    </IndexedDBProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
