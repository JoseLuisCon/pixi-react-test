import { useState, useEffect, useRef } from "react";
import { Sprite, useTick } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

import imagen from "../image1.png";
import apple from "../apple.png";

let index = 1;

export const CardDragDrop = ({ x, y, ...props }) => {
  const [rot, setRot] = useState(0);
  const requestRef = useRef();

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: x || 0, y: y || 0 });
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

  // //TODO => usar Hook useTick para la animación??
  const animate = (time) => {
    setRot((Math.cos(time / 1000) || 0) * 0.3);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <Sprite
      {...props}
      image={apple}
      interactive
      scale={[0.2 + Math.abs(rot), 0.2 + Math.abs(rot)]}
      rotation={rot}
      anchor={[0.2, 0.2]}
      cursor={"pointer"}
      name="tarjeta"
      alpha={alpha}
      position={position}
      zIndex={zIndex}
      pointerdown={onStart}
      pointerup={onEnd}
      pointerupoutside={onEnd}
      pointermove={onMove}
    />
  );
};
