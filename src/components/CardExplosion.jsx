import React, { useRef, useState } from "react";

import { Container, Sprite, useTick } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";
import carta from "../Carta_001.PNG";
import { SpriteAnimated } from "./AnimatedSprite";

const texture = PIXI.Texture.from(carta);

let i = 0;

export const CardExplosion = ({ x, y}) => {
  const [scale, setScale] = useState({ x: 0.35, y: 0.35 });
  const [animationEnd, setAnimationEnd] = useState(false);

  const container = useRef();
  let animatedSpt = useRef(true);

  useTick((delta) => {
    let contador = scale.x + 0.035; //0.03 nos sirve para retrasar
    i += 0.06 * delta;

    contador = contador - (Math.sin(i / 10) || 0) * 0.04;

    if (contador > scale.x && animatedSpt) {
    } else if (scale.x > 0.10 && animatedSpt) {
      setScale({ x: contador, y: contador });
    } else if (animatedSpt) {
      animatedSpt = false;
      setAnimationEnd(true);
      container.current.removeChild(container.current.getChildByName("sprite"));
    }
  });

  const setDestroy = (val) =>{
    if (val) container.current.removeChild(container.current.children[0]);
  }

  return (
  
      <Container name="animatedBoom" ref={container} sortableChildren={true}>
        <Sprite
          name="sprite"
          texture={texture}
          scale={scale}
          x={x}
          y={y}
          anchor={0.5}
          zIndex={2}
        />
        <SpriteAnimated
          name="animatedSpt"
          endAnimation={animationEnd}
          x={x}
          y={y}
          zIndex={1}
          setDestroy={setDestroy}
        />
      </Container>
    
  );
};
