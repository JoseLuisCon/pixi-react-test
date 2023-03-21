import { useState } from "react";

import "./App.css";
import { ReSize } from "./components/ReSize";

function App() {
  const [on, setOn] = useState(true);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [display, setDisplay] = useState(false);



  return (
    <div className="App">
      {on && <ReSize x={x} y={y} display/>}
     {/*  <div style={{ display: "block", margin: 10 }} className="positionBomm">
        <button onClick={() => setOn(true)}>Mostrar Canvas</button>
        <button onClick={() => setOn(false)}>Ocultar Canvas</button>
    
      </div> */}
    </div>
  );
}

export default App;
