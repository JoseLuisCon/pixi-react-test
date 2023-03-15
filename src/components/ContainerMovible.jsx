
import { Container, Graphics } from "@inlet/react-pixi";
import React, { useCallback } from "react";

import * as PIXI from 'pixi.js'
import { VideoPixi } from "./VideoPixi";




const options = {
  backgroundColor: 0x616d77,
  resizeTo: window,
  raf: false,
  autoDensity: true,
};

export const ContainerMovible = ({position:{x, y}}) => {
  
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(0xe1e8e6);
    g.drawRect(x, y, 600, 600);
    g.endFill();
  
  }, [x,y]);
  
  return (
    <Container sortableChildren={true} >
      <Graphics draw={draw} />
      <VideoPixi position={{x,y}}/>
    </Container>
  );
};
