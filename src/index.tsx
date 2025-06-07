import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// This is the ONLY place you should render <App />.
// Do NOT wrap App in AuthProvider here (it's already done inside App.tsx).
// Make sure this file is at your project root (usually src/index.tsx).

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);