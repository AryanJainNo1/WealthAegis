import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// This is the ONLY place you should render <App />.
// Do NOT wrap App in AuthProvider here (it's already done inside App.tsx).
// Make sure this file is at your project root (usually src/index.tsx).
createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
