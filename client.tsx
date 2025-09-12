/// <reference lib="dom" />

import { hydrateRoot } from "react-dom/client";
import { App } from "./src/mods/app/mod.tsx";

hydrateRoot(document.getElementById("app")!, <App />);