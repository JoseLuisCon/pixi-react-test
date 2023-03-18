import React, { forwardRef,  useEffect, createRef,useState } from "react";
import gsap from "gsap";

import { AnimatedSprite, Container, Sprite, useApp } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

import imagen from "../image1.png";
const texture = PIXI.Texture.from(imagen);

const spritesheet = "spritesheet.json";


export const GsapTest2 = ({scale}) => {

//   const ref = createRef();
  

 
//  useEffect(() => {
       
//       gsap.to(ref.current, {
//         y: 600,
//         duration: 2,
//         repeat: -1,
//         yoyo: true,
//       });
      
//     }, []);
       
      


  return (
    <Sprite texture={texture} scale={scale}/>
  );
};
