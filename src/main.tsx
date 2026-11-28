import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Missing root element with id "root".');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
