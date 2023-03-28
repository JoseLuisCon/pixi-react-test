import React, { Fragment, useRef, useState, useEffect } from "react";
import { Graphics, useApp } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";

import videotest from "../bridder_logo_overlay_1.webm";

const draw = (g) => {
  g.beginFill(0xefa7be);
  g.drawRoundedRect(50, 50, 100, 100, 15);
  g.endFill();
  g.beginFill(0xffffff);
  g.moveTo(80, 70);
  g.lineTo(80, 130);
  g.lineTo(130, 100);
  g.endFill();
};
const selectors = (g) => {
  g.beginFill(0xffffff,0);
  g.drawRect(0, 0, 100, 100);
  g.endFill();
  g.lineStyle(2, 0xf2eff7, 1)
  g.moveTo(0,0);
  g.lineTo(0,100);
  g.lineTo(100,100);
  g.lineTo(100,0);
  g.lineTo(0,0)
  g.endFill();
  
};

export const VideoPixiRedim = () => {
  const videoRef = useRef(null);
  const app = useApp();
  let spriteRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(false);

  const playVideo = () => {
    const container = videoRef.current.parent;

    if (container.getChildByName("video")) {
      const video = container.getChildByName("video");
      // //! Recarga de la fuente del video
      PIXI.Texture.removeFromCache(videotest); //* Eliminamos el cache de la textura cargada
      container.removeChild(video); //* Lo eliminamos del DOM
      video.destroy(); //* Eliminamos el elemento del canvas
    }

   
    const texture = PIXI.Texture.from(videotest);
    const videoSprite = new PIXI.Sprite(texture);
    videoSprite.scale = { x: 0.15, y: 0.15 };
    videoSprite.position.x = 900;
    videoSprite.name = "video";
    videoSprite.interactive = true;
    videoSprite.on('click', () => setSelectedVideo(selectedVideo))
    container.addChild(videoSprite);
     
  };
  
  useEffect(() => {
      
  }, [selectedVideo]);

  return (
    <Fragment>
      <Graphics
        draw={draw}
        interactive
        click={playVideo}
        ref={videoRef}
        cursor={"pointer"}
        position={[20, 0]}
      />
      <Graphics 
        draw={selectors}
        position={[500, 50]}
        
        visible={selectedVideo}
      />
    </Fragment>
  );
};
