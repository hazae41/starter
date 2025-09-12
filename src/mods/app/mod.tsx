import { hydrateRoot } from "react-dom/client";

function App() {
  return <div className="text-2xl font-sans">Welcome</div>
}

hydrateRoot(document.getElementById("app")!, <App />);