import {
  __toESM,
  require__,
  require_client,
  require_jsx_runtime
} from "../chunk.js";

// src/mods/app/test/index.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react = __toESM(require__());
var import_client = __toESM(require_client());
function App() {
  (0, import_react.useMemo)(() => "lol", []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: "text-2xl font-sans",
    children: "Welcome"
  });
}
var element = document.getElementById("root");
if (element == null) throw new Error("Root element not found");
(0, import_client.createRoot)(element).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
