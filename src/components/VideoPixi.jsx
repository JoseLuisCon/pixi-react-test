import React, { Fragment, useRef } from "react";
import { Container, Graphics, Sprite, unmountComponentAtNode } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";

import videotest from '../bridder_logo_overlay_1.webm'
import { JetSpriteAnimated } from "./AnimatedSprite";


const draw = (g) => {
  
  const {position} = g;
  const {x, y} = position;
  console.log("boton: ", x, y);

  g.beginFill(0xefa7be);
  g.drawRoundedRect(x, y, 90, 100, 10);
  g.endFill();
  g.beginFill(0xffffff);
  g.moveTo(x+10, y+10);
  g.lineTo(x+10, y+90);
  g.lineTo(x+80, y+45);
  g.endFill();
};



export const VideoPixi = ({position:{x , y}}) => {
  
  const videoRef = useRef(null);
  console.log("Props entrada video", x, y);

  const playVideo = () => {
    
    const container = videoRef.current.parent;
    
    if (container.getChildByName("video")) {
      
      const video = container.getChildByName("video");
      
      // //! Recarga de la fuente del video
       PIXI.Texture.removeFromCache(videotest) //* Eliminamos el cache de la textura cargada
       container.removeChild(video); //* Lo eliminamos del DOM
       video.destroy(); //* Eliminamos el elemento del canvas
           
    }
    
    const texture = PIXI.Texture.from(videotest);
    const videoSprite = new PIXI.Sprite(texture);
    console.log("Posición video:", x,"-", y);
    videoSprite.position={x:x+360, y}
    videoSprite.scale={x:0.15,y:0.15}
    videoSprite.name="video";
    
    container.addChild(videoSprite);
  }

  return (
    <Fragment >
      <Container>
        <Graphics
          draw={draw}
          interactive
          click={playVideo}
          ref={videoRef}
          cursor={"pointer"}

        > 
        </Graphics>
        <JetSpriteAnimated position={{x, y}} ></JetSpriteAnimated>
      </Container>
      
    </Fragment>
  );
};
