import React, { Fragment, useRef } from "react";
import { Graphics } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";


import videotest from '../bridder_logo_overlay_1.webm'


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

export const VideoPixi = () => {
  
  const videoRef = useRef(null);


  const playVideo = () => {
    
    
    
    const container = videoRef.current.parent;
    
    if (container.getChildByName("video")) {
      
      const video = container.getChildByName("video");
          
      PIXI.Texture.removeFromCache(videotest)
      container.removeChild(video);
      video.destroy();
    
      
    }
    
    const texture = PIXI.Texture.from(videotest);
    const videoSprite = new PIXI.Sprite(texture);
    videoSprite.name="video"
    
    container.addChild(videoSprite);



  }

  return (
    <Fragment >
      <Graphics
        draw={draw}
        interactive
        click={playVideo}
        ref={videoRef}
        cursor={"pointer"}
        position={[500,0]}
      />
    </Fragment>
  );
};
