/// <reference lib="dom" />

import { useMemo } from "react";
import { createRoot } from "react-dom/client";

function App() {
  useMemo(() => "lol", [])
  return <div className="text-2xl font-sans">Welcome</div>
}

const element = document.getElementById("root")

if (element == null)
  throw new Error("Root element not found")

createRoot(element).render(<App />)