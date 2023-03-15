import React, { Fragment, useRef } from "react";
import { Graphics, Text } from "@inlet/react-pixi";

import * as PIXI from 'pixi.js'

const draw1 = (g) => {
  g.beginFill(0x8fd7c5);
  g.drawRoundedRect(50, 50, 150, 250, 15);
  g.endFill();
};


export const ButtonsZIndex = () => {
  const refContainer = useRef(null);



  return (
    <Fragment>
      <Graphics
        draw={draw1}
        interactive
        cursor={"pointer"}
        ref={refContainer}
      >
      </Graphics>
   
    </Fragment>
  );
};
