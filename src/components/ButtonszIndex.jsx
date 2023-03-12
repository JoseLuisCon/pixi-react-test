import React, { Fragment, useRef } from "react";
import { Graphics, Text } from "@inlet/react-pixi";


const draw1 = (g) => {
  g.beginFill(0x8FD7C5);
  g.drawRoundedRect(50, 50, 250, 50, 15);
  g.endFill();
};

export const ButtonsZIndex = () => {
  const refContainer = useRef(null);

  const toggleIndex = () => {
    const childrenContainer = refContainer.current.parent;
    const Tarjeta = childrenContainer.getChildByName("tarjeta");
    const Video = childrenContainer.getChildByName("video");
    if (!Video) return;
    const IndexTarjeta = childrenContainer.getChildIndex(Tarjeta);
    const IndexVideo = childrenContainer.getChildIndex(Video);

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
          <Text
          
            position={[90, 59]}
            text="Cambiar zIndex"
          />
      </Graphics>
    </Fragment>
  );
};
