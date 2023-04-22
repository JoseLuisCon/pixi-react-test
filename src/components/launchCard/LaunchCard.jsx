import React, { useEffect, useRef, useState } from "react";

import { Container, Sprite, Text, useTick, useApp } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";

import { SpriteAnimated } from "../AnimatedSprite";

const TWEEN = require("@tweenjs/tween.js");

let i = 0;

export const LaunchCard = ({ dataCard }) => {
  const [position, setPosition] = useState({ x: dataCard.x, y: dataCard.y });
  const [dataImg, setDataImg] = useState(dataCard.data);

  const [animationEnd, setAnimationEnd] = useState(false);

  const [scale, setScale] = useState({ x: 0.25, y: 0.25 });
  const [angle, setAngle] = useState(0);

  const app = useApp();
  const container = useRef(null);
  let animatedSpt = useRef(true);

  const initShowCard = () => {
    // let { angle, ...props } = container.current;

    const tween = new TWEEN.Tween({ angle: 0 })
      .to({ angle: 360 }, 725)
      .repeat(1)
      .onUpdate(() => {
        setAngle((angle) => {
          return angle - 4;
        });
      })
      .start();
    // .onComplete(() => {});
  };

  const animate = (time) => {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  };

  const effecShowCard = () => {
    initShowCard();
    animate();
  };

  const setDestroy = (val) => {
    if (val) {
      container.current.removeChild(
        container.current.getChildByName("animatedSpt", true)
      );
    }
  };

  useEffect(() => {
    effecShowCard(0);
    setDataImg(dataCard.data);
  }, [dataCard]);

  return (
    <Container
      name="animatedBoom"
      ref={container}
      interactive={true}
      cursor="pointer"
      sortableChildren={true}
      x={position.x}
      y={position.y}
      angle={angle}
      scale={scale}
    >
      <Sprite image={dataImg["bg-border"]} anchor={0.5} />
      <Sprite image={dataImg["bg-card"]} anchor={0.5} />
      <Sprite image={dataImg["rarity"]} anchor={0.5} />
      {dataImg["logo"] !== "" && (
        <Sprite image={dataImg["logo"]} anchor={0.5} />
      )}
      <Sprite image={dataImg["img"]} anchor={0.5} />

      <Text
        text={dataImg["text"]}
        zIndex={2}
        x={(container.current?.width / 2) * -1}
        y={container.current?.height}
        style={
          new PIXI.TextStyle({
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fontSize: 36,
            fill: "white",
            align: "center",
            wordWrap: true,
            wordWrapWidth: container.current?.width * 2,
          })
        }
      />

      <SpriteAnimated
        name="animatedSpt"
        endAnimation={animationEnd}
        zIndex={1}
        x={0}
        y={0}
        setDestroy={setDestroy}
      />
    </Container>
  );
};
