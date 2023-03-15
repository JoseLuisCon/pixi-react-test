import { useEffect, useRef, useState } from "react";
import { unmountComponentAtNode, render, useApp } from "@inlet/react-pixi";
import "./App.css";
import { ReSize } from "./components/ReSize";

function App() {
  const [on, setOn] = useState(true);

  return (
    <div className="App">
      {on && <ReSize />}
    </div>
  );
}

export default App;
