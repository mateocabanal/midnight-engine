import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const fontStyles = document.createElement("style");
fontStyles.textContent = `
  @font-face { font-family: "Pixelify Sans"; src: url("${import.meta.env.BASE_URL}fonts/PixelifySans-Variable.ttf") format("truetype"); font-display: block; font-weight: 400 700; }
  @font-face { font-family: "Silkscreen"; src: url("${import.meta.env.BASE_URL}fonts/Silkscreen-Regular.ttf") format("truetype"); font-display: block; font-weight: 400; }
`;
document.head.append(fontStyles);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
