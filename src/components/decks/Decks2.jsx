import React, { useState, useRef, useEffect } from "react";

import { Container, Sprite, useApp, useTick, Text } from "@inlet/react-pixi";

import { initialData } from "./initialData";

import * as PIXI from "pixi.js";

// const TWEEN = require("@tweenjs/tween.js");
const ReDistribution = (cartas) => {
  if (!cartas) return;
  
  let initialAngle = cartas.length === 1 ? 0 : cartas.length * 7;
  let rotationProgress = initialAngle;
  const numCartas = cartas.length;
  cartas.map((carta, index) => {
    if (carta.name.includes("carta-0")) {
      carta.angle = initialAngle;
    } else {
      rotationProgress = rotationProgress - 15;
      carta.angle = rotationProgress;
    }
    carta.zIndex = numCartas - index;
  });
};


export const Decks2 = () => {
  const app = useApp();
  const [zIndex, setZIndex] = useState(0);
  const [cartas, setCartas] = useState(initialData);
  const [cartasCanvas, setCartasCanvas] = useState(null);
  const [cartaSelected, setCartaSelected] = useState(null);
  // const [position, setPosition] = useState({ x: 200, y: 200 });

  const angleInitial = useRef(null);
  const isDragging = useRef(false);
  const SpriteCardSelect = useRef(null);
  const initialPosition = useRef({ x: 0, y: 0 });
  const alpha = useRef(1);
  const zIndexPrevius = useRef(null);

  useEffect(() => {
    cargasCanvas();
    ReDistribution(cartasCanvas);
  }, []);

  useEffect(() => {
    ReDistribution(cartasCanvas);
  }, [cartasCanvas?.length]);

  // console.log(cartas);

  // const deleteCard = () => {
  //   let newArray = cartas.filter(
  //     (carta) => carta.id !== indexCardSelect.current
  //   );

  //   newArray = newArray.map(({ id, ...props }, index) => {
  //     const newCart = { id: index, ...props };
  //     return { ...newCart };
  //   });
  //   setCartas([...newArray]);
  // };



  // const initReturn = () => {
  //   let { x, y, ...props } = cartas[indexCardSelect.current];

  //   const tween = new TWEEN.Tween({
  //     x: cartas[indexCardSelect.current].x,
  //     y: cartas[indexCardSelect.current].y,
  //   })
  //     .to({ x: initialPosition.current.x, y: initialPosition.current.y }, 1500)

  //     .easing(TWEEN.Easing.Elastic.Out)
  //     .onUpdate(({ x, y }) => {
  //       cartas[indexCardSelect.current] = {
  //         x: Math.trunc(x),
  //         y: Math.trunc(y),
  //         ...props,
  //       };

  //       setCartas([...cartas]);
  //     })
  //     .start(); // Start the tween immediately.
  // };

  // const effectReturnCarta = () => {
  //   initReturn();
  //   animate();
  // };
  // // const effectDisaperCard = ()=>{
  // //   initDisapear();
  // //   animate();
  // // }

  // function onMove(e) {
  //   // console.log("🚀 ~ file: Decks.jsx:107 ~ onMove ~ e:", e)
  //   if (isDragging.current) {
  //     let { x, y, ...props } = cartas[indexCardSelect.current];
  //     x = Math.trunc(e.data.global.x);
  //     y = Math.trunc(e.data.global.y);

  //     cartas[indexCardSelect.current] = { x, y, ...props };

  //     setCartas([...cartas]);

  //     // //* EFECTO DE DESVANECIMIENTO EN DOS PASOS
  //     if (
  //       Math.abs(
  //         initialPosition.current.y - cartas[indexCardSelect.current].y
  //       ) > 300 ||
  //       Math.abs(
  //         initialPosition.current.x - cartas[indexCardSelect.current].x
  //       ) > 300
  //     ) {
  //       alpha.current = 0.3;
  //     } else if (
  //       Math.abs(
  //         initialPosition.current.y - cartas[indexCardSelect.current].y
  //       ) > 200 ||
  //       Math.abs(
  //         initialPosition.current.x - cartas[indexCardSelect.current].x
  //       ) > 200
  //     ) {
  //       alpha.current = 0.7;
  //     } else {
  //       alpha.current = 1;
  //     }
  //     //* EFECTO DE DESVANECIMIENTO CUANDO SE ALEJA LA CARTA
  //     // setAlpha(
  //     //   1 - Math.abs(InitialPosition.y - cartas[IndexCardSelect.current].y) * 0.006 || 1 - Math.abs(InitialPosition.x - cartas[IndexCardSelect.current].x) * 0.006
  //     // );
  //     // setAlpha(
  //     //   1 - Math.abs(InitialPosition.x - cartas[IndexCardSelect.current].x) * 0.006
  //     // );
  //   }
  // }

  // const getCanvaCartaId = (id) => {
  //   return app.stage.getChildByName(`carta-${id}`);
  // };

  const cargasCanvas = () => {
    
    const { children } = app.stage.children[0];

    if (children.length === 0) return;

    //Selección de las cartas
    const cartasSprite = children.map((carta) => {
      if (!carta.isSprite && !carta.name.includes("carta-")) return;
      return carta;
    });
    // Pasamos los datos de las cartas y las convertimos en un array de Sprite
    setCartasCanvas(cartasSprite);
    ReDistribution(cartasSprite);
  };

  const onStart = (e) => {
    isDragging.current = true;
    // SpriteCardSelect.current = e.target.name;
    
    // angleInitial.current = e.target.angle;
    // initialPosition.current = {
    //   x: e.target.x,
    //   y: e.target.y,
    // };
    // zIndexPrevius.current = e.target.zIndex;
   
    setCartaSelected(e.target);
    // //   // let { x, y, rot, anchor, ...props } = cartas[indexCardSelect.current];
    // //   //  const newCart = {
    // //   //    rot: 0,
    // //   //    x: Math.trunc(e.data.global.x),
    // //   //    y: Math.trunc(e.data.global.y),
    // //   //    anchor: 0.5,
    // //   //    ...props,
    // //   //  };
    
    console.log("🚀 ~ file: Decks2.jsx:184 ~ onStart ~ cartaSelected:", cartaSelected)
  };

  const onEnd = () => {
    console.log("onEnd", cartasCanvas);
    isDragging.current = false;
    

    

    // let { rot, anchor, ...props } = cartas[indexCardSelect.current];
    // // let desplazY = (Math.abs(initialPosition.current.y - y))
    // // let desplazX = (Math.abs(initialPosition.current.x - x))
    // if (
    //   Math.abs(initialPosition.current.y - cartas[indexCardSelect.current].y) >
    //     300 ||
    //   Math.abs(initialPosition.current.x - cartas[indexCardSelect.current].x) >
    //     300
    // ) {
    //   //effectDisaperCard();
    //   deleteCard();
    // } else {
    //   const newCarta = {
    //     rot: angleInitial.current,
    //     anchor: { x: 0.4, y: 0.8 },
    //     ...props,
    //   };
    //   cartas[indexCardSelect.current] = newCarta;
    //   setCartas([...cartas]);
    //   effectReturnCarta();
    //   alpha.current = 1;
    //   setZIndex(cartas[indexCardSelect.current]?.zIndex);
    // }
  };
  // const animate = (time) => {
  //   requestAnimationFrame(animate);
  //   TWEEN.update(time);
  // };

  return cartas.map((carta, index) => (
    <Sprite
      id={carta.id}
      key={index}
      image={carta.img}
      interactive={true}
      scale={0.5}
      anchor={carta.anchor}
      // width={540}
      // height={800}
      angle={carta.rot}
      cursor={"pointer"}
      name={`carta-${index}`}
      // alpha={indexCardSelect.current == carta.id ? alpha.current : 1}
      x={carta.x}
      y={carta.y}
      zIndex={ (SpriteCardSelect.current === carta.name) ? zIndex : cartas[carta.id].zIndex}
      pointerdown={onStart}
      pointerup={onEnd}
      pointerupoutside={onEnd}
    />
  ));
};
