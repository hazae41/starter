import { useMemo } from "react";
import "./index.css";

export default function App() {
  useMemo(() => "lol", [])
  return <div className="text-2xl font-sans">Welcome</div>
}

globalThis.App = App