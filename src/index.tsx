import { ThemeProvider } from "@emotion/react";
import { SolvedGlobalStyles, solvedThemes } from "@solved-ac/ui-react";
import { MathJaxContext } from "better-react-mathjax";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const config = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    tags: "ams",
    autoload: {
      color: [],
      colorv2: ["color"],
    },
    packages: { "[+]": ["noerrors"] },
  },
  options: {
    ignoreHtmlClass: "no-mathjax|redactor-editor",
    processHtmlClass: "mathjax",
    enableMenu: false,
  },
  chtml: {
    scale: 0.9,
  },
  loader: {
    load: ["input/tex", "output/chtml", "[tex]/noerrors"],
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MathJaxContext config={config}>
      <ThemeProvider theme={solvedThemes.light}>
        <SolvedGlobalStyles />
        <App />
      </ThemeProvider>
    </MathJaxContext>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
