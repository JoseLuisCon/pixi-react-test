import React,{useEffect, useLayoutEffect, useRef} from "react";

import { Sprite } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

import gsap,{PixiPlugin} from "gsap/all";



import imagen from "../image1.png";
const texture = PIXI.Texture.from(imagen);


export const GsapTest2 = ({children, timeline, index, rotation, scale}) => {
 
  const refSprite = useRef();
 
   console.log(index, rotation, scale, children);
 
    useLayoutEffect(()=>{
    timeline && 
    timeline.to(refSprite.current,{
        rotation: rotation,
       })
       .from (refSprite.current,{
          scale: scale,
       })
   },[timeline, rotation, index, scale])

  return (
    <Sprite texture={texture} ref={refSprite} anchor={0.5} scale={{ x: 0.15, y: 0.15 }}></Sprite>
  );
};
