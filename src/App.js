import { useEffect, useRef, useState } from "react";
import { unmountComponentAtNode, render, useApp } from "@inlet/react-pixi";
import "./App.css";
import { ReSize } from "./components/ReSize";
import GsapPassing from "./components/GsapPassing";

function App() {
  
  return (
  /*  <div className="App">

     <GsapPassing/>
   </div> */
    <div className="App">
        <ReSize />
      </div> 
  );
}

export default App;