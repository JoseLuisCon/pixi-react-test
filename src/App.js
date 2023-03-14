import { useEffect, useRef, useState } from "react";
import { unmountComponentAtNode, render, useApp } from "@inlet/react-pixi";
import "./App.css";
import { ReSize } from "./components/ReSize";

function App() {
  const [on, setOn] = useState(true);

  return (
    <div className="App">
      {on && <ReSize />}
      <div style={{ display: "block", margin: 10 }}>
        <button onClick={() => setOn(true)}>Mostrar Canvas</button>
        <button onClick={() => setOn(false)}>Ocultar Canvas</button>
      </div>
    </div>
  );
}

export default App;
