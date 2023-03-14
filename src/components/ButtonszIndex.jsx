import React, { Fragment, useRef } from "react";
import { Graphics, Text } from "@inlet/react-pixi";

import * as PIXI from 'pixi.js'

const draw1 = (g) => {
  g.beginFill(0x8fd7c5);
  g.drawRoundedRect(50, 50, 250, 50, 15);
  g.endFill();
};
const draw2 = (g) => {
  g.beginFill(0x8f1ec5);
  g.drawRoundedRect(1100, 550, 250, 50, 15);
  g.endFill();
};
const draw3 = (g) => {
  g.beginFill(0x2c1ec5);
  g.drawRoundedRect(100, 850, 200, 50, 15);
  g.endFill();
};

export const ButtonsZIndex = () => {
  const refContainer = useRef(null);

  const toggleIndex = () => {
    const childrenContainer = refContainer.current.parent;
    const Tarjeta = childrenContainer.getChildByName("tarjeta");
    const Video = childrenContainer?.getChildByName("video");
    // if (!Video) return;
    const IndexTarjeta = childrenContainer.getChildIndex(Tarjeta);
    const IndexVideo = childrenContainer?.getChildIndex(Video);

    // De momento, para probar solo cambio el index entre el video y la tarjeta en movimiento
    // Se podría modificar el index con un evento de click en el elemento
    if (IndexTarjeta > IndexVideo) {
      childrenContainer.setChildIndex(Tarjeta, 1);
      childrenContainer.setChildIndex(Video, 2);
    } else {
      childrenContainer.setChildIndex(Tarjeta, 2);
      childrenContainer.setChildIndex(Video, 1);
    }
  };

  return (
    <Fragment>
      <Graphics
        draw={draw1}
        interactive
        click={toggleIndex}
        cursor={"pointer"}
        ref={refContainer}
      >
        <Text position={[90, 59]} text="Cambiar zIndex" />
      </Graphics>
      <Graphics draw={draw2}>
        <Text position={[1125, 560]} text="Animated Sprite" style={{fill: 'white'}}/>
      </Graphics>
      <Graphics draw={draw3}>
        <Text position={[110, 860]} text="Drag and Drop" style={{fill: 'white'}} />
      </Graphics>

    </Fragment>
  );
};
