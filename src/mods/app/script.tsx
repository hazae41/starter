import { ReactNode } from "react";

declare global {
  var App: (() => ReactNode) | undefined;
}

function Page() {
  return <div className="text-2xl font-sans">Welcome</div>
}

globalThis.App = Page;