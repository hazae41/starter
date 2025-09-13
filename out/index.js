import {
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk.js";

// src/mods/app/index.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react = __toESM(require_react());
function App() {
  (0, import_react.useMemo)(() => "lol", []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: "text-2xl font-sans",
    children: "Welcome"
  });
}
globalThis.App = App;
