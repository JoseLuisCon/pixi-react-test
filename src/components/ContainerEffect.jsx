import React, { forwardRef,  useEffect, createRef,useState } from "react";
import gsap from "gsap";

import { AnimatedSprite, Container, Sprite, useApp } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

import imagen from "../image1.png";
import { GsapAnimatedSprite } from "./GsapAnimatedSprite";
import { GsapTest2 } from "./GsapTest2";
const texture = PIXI.Texture.from(imagen);

const spritesheet = "spritesheet.json";


export const ContainerEffect = ({position:{x, y}}) => {

  const ref = createRef();
  const refSprite = createRef();
  const refBumb = createRef();
  

 
 useEffect(() => {
       
      gsap.to(ref.current, {
        y: y + 200,
        duration: 1,
        repeat: -1,
        yoyo: true,
      });
      gsap.to(ref.current, {
        x: x + 50,
        duration: 2,
        repeat: -1,
        yoyo: true,
      });
      
       gsap.to(refSprite.current,{
         scale: 2,
         duration: 2,
         repeat: -1,
         yoyo:true
       })



    }, []);
       
      


  return (
    <Container ref={ref} position={{x,y}}>
      <GsapAnimatedSprite ref={refBumb}></GsapAnimatedSprite>
      <GsapTest2 ref={refSprite}></GsapTest2>
    </Container>
  );
};
