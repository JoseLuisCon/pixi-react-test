import React, {useState, useEffect} from 'react'

import * as PIXI from 'pixi.js'


import {
  Container,
  AnimatedSprite,
  useApp,
  useTick,
  Sprite
} from '@inlet/react-pixi';

import imagen from "../image1.png";


// const spritesheet = "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json";
const spritesheet = "spritesheet.json";


export const JetSpriteAnimated = ({position:{x, y}}) => {

  const [frames, setFrames] = useState([]);
  const [pos, setPos] = useState({x, y});
  const app = useApp();

  //  useTick(delta => setRot(r => r + (0.01 * delta)));
      // useTick(delta => console.log(Math.tan(delta)) );

  // load
  useEffect(async () => {
   
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
    <Container  x={pos.x} y={pos.y}>
      <AnimatedSprite
        animationSpeed={0.15}
        isPlaying={true}
        textures={frames}
        scale={(0.5,0.5)}
        anchor={0.5}
        
      />
      <Sprite 
        image={imagen}
        scale={(0.25, 0.25)}
      
      />


    </Container>
  )
}
