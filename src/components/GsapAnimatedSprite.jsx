import React, { useEffect, createRef,useState } from "react";
import gsap from "gsap";

import { AnimatedSprite, useApp } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const spritesheet = "spritesheet.json";


export const GsapAnimatedSprite = () => {
  
  const [frames, setFrames] = useState([]);
  const app = useApp();
  

 useEffect( async () => {
  
    app.loader.add(spritesheet).load((_, resource) => {
    setFrames(
      Object.keys(resource[spritesheet].data.frames).map(frame =>
        PIXI.Texture.from(frame)
        )
        );
      });
      
  
    }, []);
  

  
  
  
    if (frames.length === 0) {
      return null;
    }   


  return (
      <AnimatedSprite
      animationSpeed={0.15}
      isPlaying={true}
      textures={frames}
      scale={(0.35,0.35)}
      anchor={0.5}
      x={300}
      y={200}
    />
  );
};
