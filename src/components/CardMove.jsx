import { useState, useEffect,useRef } from "react";
import { Sprite } from "@inlet/react-pixi";


import imagen from "../image1.png";

export const CardMove = () => {

  const [state, setState] = useState(0);

  const [imagenRef] = useState(imagen)
  const requestRef = useRef()
 
  //TODO => usar Hook useTick para la animación
  const animate = time => {
 
    setState( (Math.cos(time/1000) || 0) * 0.3)
    requestRef.current = requestAnimationFrame(animate);
    
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <Sprite
      image={imagenRef}
      interactive
      x={550}
      y={320}
      scale={[0.2 + Math.abs(state),0.2+Math.abs( state)]}
      rotation={state}
      anchor={[0.2, 0.2]}
      cursor={'pointer'}
      name="tarjeta"
    />

  );
};
