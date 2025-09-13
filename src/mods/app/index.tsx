/// <reference lib="dom" />

import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

export function App() {
  useMemo(() => "lol", [])
  return <div className="text-2xl font-sans">Welcome</div>
}

createRoot(document.getElementById("app")!).render(<App />);