import {
  __toESM,
  require_jsx_runtime
} from "../chunk.js";

// src/mods/app/test/index.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime());
function App() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: "text-2xl font-sans",
    children: "Welcome"
  });
}
globalThis.App = App;
