import React, { useEffect, createRef, forwardRef, useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { Container, useApp, Sprite } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import { GsapAnimatedSprite } from "./GsapAnimatedSprite";
import { GsapTest2 } from "./GsapTest2";

import imagen from "../image1.png";
const texture = PIXI.Texture.from(imagen);



export const ContainerEffect = ({position:{x, y}}) => {

  const ref = useRef();
  const [tl, setTl] = useState();

  useLayoutEffect(()=>{
    
    let ctx = gsap.context ( () =>{
      const tl = gsap.timeline({defaults:{duration: 2}});
      tl.to(ref.current, {
        x: x +250,
        y: y + 500,
        ease: 'bounce'
      })
      setTl(tl);    
    })
      return ()=> ctx.revert();
    }, [])

 

  return (
  
    <Container ref={ref} position={{x,y,}}  >
      <GsapTest2 timeline={tl} rotation={360} index={1} scale={{ x: 0.25, y: 0.25 }}/>
      <GsapAnimatedSprite timeline={tl} x={x} y={y} index={2}/>
      
    </Container>
  );
};
