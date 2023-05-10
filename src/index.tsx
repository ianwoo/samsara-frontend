import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Samsara from "./Samsara";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

const container = document.getElementById("root");

const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  return library;
};

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Samsara />
      </Web3ReactProvider>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
