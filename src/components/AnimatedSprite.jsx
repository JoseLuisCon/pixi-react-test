import React, {useState, useEffect} from 'react'

import * as PIXI from 'pixi.js'



import {
  Container,
  AnimatedSprite,
  useApp,
  useTick
} from '@inlet/react-pixi';


// const spritesheet = "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json";
const spritesheet = "spritesheet.json";


export const JetSpriteAnimated = () => {

  const [frames, setFrames] = useState([]);
  const [rot, setRot] = useState(0);
  const app = useApp();

  // useTick(delta => setRot(r => r + (0.01 * delta)));

  // load
  useEffect(() => {
   
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
    <Container rotation={rot} x={1200} y={350}>
      <AnimatedSprite
        animationSpeed={0.25}
        isPlaying={true}
        textures={frames}
        anchor={0.5}
        
      />
    </Container>
  )
}
