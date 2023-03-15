import { useState, useEffect,useRef } from "react";
import { Sprite, useTick } from "@inlet/react-pixi";


import imagen from "../image1.png";

export const CardMove = () => {

  const [state, setState] = useState(0);

  const requestRef = useRef()
   

  // //TODO => usar Hook useTick para la animación??
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
       image={imagen}
       cursor={'pointer'}
       name="tarjeta"
       rotation={null}
     />
    
    );
};
