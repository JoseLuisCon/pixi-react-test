import React, { useRef,useState } from "react";

import { Sprite, useApp } from "@inlet/react-pixi";
import createGraph from "../assets/js/tween/createGraph";
import '../assets/js/tween/RequestAnimationFrame'
import image from "../Carta_001.PNG";

const TWEEN = require("@tweenjs/tween.js");

export const CardTween = () => {
  const app = useApp();
  const spriteRef = useRef(null);
  const [coords, setCoords] = useState({ x: 100, y: 100 });

  const init = () => {
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
      .to({ x: 800, y: 500 }, 2000) // Move to (300, 200) in 1 second.
      
      .easing(TWEEN.Easing.Bounce.In) // Use an easing function to make the animation smooth.
      // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        // Called after tween.js updates 'coords'.
        // Move 'box' to the position described by 'coords' with a CSS translation.
        // box.style.setProperty(
        //   "transform",
        //   `translate(${coords.x}px, ${coords.y}px)`
        // );
        setCoords({x: coords.x, y: coords.y})
        console.log(coords);

      })
      .start(); // Start the tween immediately.
  };

  const animate = (time) => {
    requestAnimationFrame(animate);

    TWEEN.update(time);
  };


  return (
    <>
      <Sprite
        ref={spriteRef}
        image={image}
        scale={0.1}
        anchor={0.5}
        interactive={true}
        position={coords}
        click={() => {
          init();
          animate();
        }}
      />
    </>
  );
};
