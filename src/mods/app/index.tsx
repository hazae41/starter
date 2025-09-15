/// <reference lib="dom" />

import { Rewind } from "@hazae41/rewind";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  useEffect(() => {
    console.log("App mounted")
  }, [])

  return <div className="text-2xl font-sans">
    Welcome
  </div>
}

const root = document.getElementById("root")

if (root == null)
  throw new Error("Root element not found")

root.hidden = true

createRoot(root).render(<App />)

await new Rewind(document).compile()

root.hidden = false