import React, {useRef} from "react";
import { Sprite } from "@inlet/react-pixi";


export const Carta = ({
  id,
  image,
  position,
  name,
  alpha,
  angle,
  anchor,
  zIndex,
  scale,
  clickStart,
  clickEnd,
  mouseMove,
  passRef
}) => {

  const referenciaSprite = useRef(null);

  
 passRef(referenciaSprite.current);

  return (
    <Sprite
      id={id}
      ref={referenciaSprite}
      image={image}
      position={position}
      angle={angle}
      alpha={alpha}
      anchor={anchor}
      zIndex={zIndex}
      scale={scale}
      interactive={true}
      cursor="pointer"
      pointerdown={clickStart}
      pointerup={clickEnd}
      pointermove={mouseMove}
      name={name}
    />
  );
};
