import { Sprite, useApp } from "@inlet/react-pixi";
import React, { useState, useRef, useEffect } from "react";


import { initialData } from "./initialData";

const Positions = [
  {x: 300, y: 250 },
  {x: 350 , y: 250 },
  {x: 400 , y: 250},
]


let index = 1;

export const Decks = ({ x, y, ...props }) => {
  const app = useApp()
  const [cartas, setCartas] = useState(initialData);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({...Positions[0]});
  const [alpha, setAlpha] = useState(1);
  const [zIndex, setZIndex] = useState(index);


  const onStart = (e) => {
    isDragging.current = true;
    offset.current = {
      x: e.data.global.x - position.x,
      y: e.data.global.y - position.y,
    };

    setAlpha(0.5);
    setZIndex(index++);
  };

  const onEnd = () => {
    isDragging.current = false;
    setAlpha(1);
    setZIndex(0);
  };

  function onMove(e) {
    if (isDragging.current) {
      
      setPosition({
        x: e.data.global.x - offset.current.x,
        y: e.data.global.y - offset.current.y,
      });
    }
  }

  useEffect(() => {
    setPosition({x: 550 , y: 200  })
  }, []);

  return cartas.map((carta, index) => (
    <Sprite
      {...props}
      key={carta.id}
      image={carta.img}
      interactive
      scale={0.5}
      cursor={"pointer"}
      name={carta.name}
      alpha={alpha}
      position={position}
      zIndex={zIndex}
      pointerdown={onStart}
      pointerup={onEnd}
      pointerupoutside={onEnd}
      pointermove={onMove}
    />
  ));
};
