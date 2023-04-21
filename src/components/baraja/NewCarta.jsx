import React, { useRef, useEffect, useState } from "react";
import { Container, Sprite, Text } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";

export const NewCarta = ({
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
  passRef,
}) => {
  const referenciaSprite = useRef(null);

  useEffect(() => {
    //  fetch(image["bg-border"])
    //    .then(data => data.json)
    //    .then(data => setImgBorder(data))
    //    .catch (error => console.error("Error de carga 💥 ", error))

    passRef(referenciaSprite.current);
  }, []);

  return (
    <>
      <Container
        position={position}
        zIndex={zIndex}
        sortableChildren={true}
        interactive={true}
        id={id}
        angle={angle}
        pointerdown={clickStart}
        pointerup={clickEnd}
        pointermove={mouseMove}
        cursor="pointer"
        anchor={anchor}
        
        >
        <Sprite
          ref={referenciaSprite}
          image={image["bg-border"]}
          alpha={alpha}
          scale={scale}
          angle={angle}
          anchor={anchor}
          name={name}
        />
        <Sprite
          image={image["bg-card"]}
          alpha={alpha}
          scale={scale}
          anchor={anchor}
          angle={angle}
        />
        <Sprite
          image={image["rarity"]}
          alpha={alpha}
          scale={scale}
          anchor={anchor}
          angle={angle}
        />
        {image["logo"] !== "" && (
          <Sprite
            image={image["logo"]}
            alpha={alpha}
            scale={scale}
            anchor={anchor}
            angle={angle}
          />
        )}
        <Sprite
          image={image["img"]}
          alpha={alpha}
          scale={scale}
          anchor={anchor}
          angle={angle}
        />

        <Text
          text={image["text"]}
          zIndex={zIndex}
          x={-45}
          angle={angle}
          style={
            new PIXI.TextStyle({
              fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
              fontSize: 18,
              fill: "white",
              align: "center",
              wordWrap: true,
              wordWrapWidth: referenciaSprite.current?.width - 10,
            })
          }
        />
      </Container>
    </>
  );
};
