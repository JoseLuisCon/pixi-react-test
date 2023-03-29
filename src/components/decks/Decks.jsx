import React, { useState, useRef, useEffect } from "react";

import { Container, Sprite, useApp, useTick } from "@inlet/react-pixi";

import { initialData } from "./initialData";

import * as PIXI from "pixi.js";

const cartaImg = "img/Carta_001.PNG";

const texture = PIXI.Texture.from(cartaImg);

export const Decks = () => {
  const app = useApp();
  const [cartas, setCartas] = useState(initialData);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [angleInitial, setAngleInitial] = useState(null);
  const [IndexCardSelect, setCardIndex] = useState(null);
  const [InitialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [anchorCart, setAnchorCart] = useState({ x: 0.4, y: 0.8 })
  const [alpha, setAlpha] = useState(1);
  const [zIndex, setZIndex] = useState(0);
  const FondoRef = useRef();

  const onStart = (e) => {
    console.log("🚀 ~ file: Decks.jsx:26 ~ onStart ~ e:", e.data.global)
    
    isDragging.current = true;
    
    setCardIndex(e.target.id);

    
    offset.current = {
      x: e.data.global.x - cartas[e.target.id]?.x,
      y: e.data.global.y - cartas[e.target.id]?.y,
    };
    
    setAngleInitial(cartas[e.target.id].rot);
    
    setInitialPosition({ x: cartas[e.target.id].x, y: cartas[e.target.id].y });
    
    setAnchorCart({x: 0.5, y:0.5})
    let { x, y, rot, ...props } = cartas[e.target.id];
    const newCart = { rot: 0, x:Math.trunc(e.data.global.x), y:Math.trunc(e.data.global.y), ...props };
    cartas[e.target.id] = newCart;
    setCartas([...cartas]);

    setZIndex(999);
  };

  const deleteCard = () => {
    let newArray = cartas.filter((carta) => carta.id !== IndexCardSelect);
    newArray = newArray.map(({ id, ...props }, index) => {
      return { id: index, ...props };
    });
    setCartas(newArray);
  };

  const onEnd = () => {
    isDragging.current = false;

    let { x, y, rot, ...props } = cartas[IndexCardSelect];

    if (
      Math.abs(InitialPosition.y - y) > 300 ||
      Math.abs(InitialPosition.x - x) > 300
    ) {
      deleteCard();
    } else {
      const newCarta = { x, y, rot: angleInitial, ...props };
      cartas[IndexCardSelect] = newCarta;
      setAnchorCart({ x: 0.4, y: 0.8 })
      effectReturnCarta();
      setAlpha(1);
      setZIndex(cartas[IndexCardSelect]?.zIndex);
      setCartas([...cartas]);
    }
  };

  const effectReturnCarta = () => {
    const xInitial = InitialPosition.x;
    const yInitial = InitialPosition.y;

    if (
      xInitial === cartas[IndexCardSelect].x &&
      yInitial === cartas[IndexCardSelect].y
    )
      return;

    const desplazamiento = setInterval(() => {
      if (
        cartas[IndexCardSelect].x !== xInitial ||
        cartas[IndexCardSelect].y !== yInitial
      ) {
        let { x, y, ...props } = cartas[IndexCardSelect];

        if (x !== xInitial) {
          xInitial < x
            ? (x = cartas[IndexCardSelect].x - 1)
            : (x = cartas[IndexCardSelect].x + 1);
        }
        if (y !== yInitial) {
          yInitial < y
            ? (y = cartas[IndexCardSelect].y - 1)
            : (y = cartas[IndexCardSelect].y + 1);
        }
        cartas[IndexCardSelect] = { x, y, ...props };
        setCartas([...cartas]);
      } else {
        clearInterval(desplazamiento);
      }
    }, 2);
    
  };

  function onMove(e) {
  // console.log("🚀 ~ file: Decks.jsx:107 ~ onMove ~ e:", e)


    
    if (isDragging.current) {
      
      let { x, y, ...props } = cartas[IndexCardSelect];

      x = Math.trunc(e.data.global.x);
      y = Math.trunc(e.data.global.y);

      cartas[IndexCardSelect] = { x, y, ...props };

      setCartas([...cartas]);

      //* EFECTO DE DESVANECIMIENTO EN DOS PASOS
       if (
         Math.abs(InitialPosition.y - cartas[IndexCardSelect].y) > 300 ||
         Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) > 300
       ){
         setAlpha(0.3)
       }
       else if (
         Math.abs(InitialPosition.y - cartas[IndexCardSelect].y) > 200 ||
         Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) > 200
       ){
         setAlpha(0.7)
       }else{
         setAlpha(1);
       }
      //* EFECTO DE DESVANECIMIENTO CUANDO SE ALEJA LA CARTA
      // setAlpha(
      //   1 - Math.abs(InitialPosition.y - cartas[IndexCardSelect].y) * 0.006 || 1 - Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) * 0.006
      // );
      // setAlpha(
      //   1 - Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) * 0.006
      // );
    }
  }

  const setDistribution = (numCards) => {
      
    console.log("🚀 ~ file: Decks.jsx:143 ~ setDistribution ~ numCards:", numCards)
      
    let initialAngle = (numCards === 1) ? 0 : numCards * 5;
    let rotationProgress = initialAngle;

    const newCards = cartas.map((carta, index) => {
      let { rot, zIndex, ...props } = carta;
      if (index === 0) {
        rot = initialAngle;
      } else {
        rotationProgress += (-10);
        rot = rotationProgress;
      }
      zIndex = numCards - index;
      const newCarta = { rot, zIndex, ...props };
      return newCarta;
    });
    
    setCartas(newCards)
  };

  useEffect(() => {
    setDistribution(cartas.length);
  }, [cartas.length]);
  useEffect(() => {
    setDistribution(cartas.length);
  }, []);

  return cartas.map((carta, index) => (
    <>
      <Sprite
        ref={FondoRef}
        id={carta.id}
        key={index}
        image={carta.img}
        interactive
        scale={0.5}
        anchor={IndexCardSelect == carta.id ? anchorCart : { x: 0.4, y: 0.8 }}
        // width={540}
        // height={800}
        angle={carta.rot}
        cursor={"pointer"}
        name={carta.name}
        alpha={IndexCardSelect == carta.id ? alpha : 1}
        position={{ x: cartas[carta.id].x, y: cartas[carta.id].y }}
        zIndex={IndexCardSelect == carta.id ? zIndex : cartas[carta.id].zIndex}
        pointerdown={onStart}
        pointerup={onEnd}
        pointerupoutside={onEnd}
        pointermove={onMove}
      />
      {/* <Sprite
        image={cartaImg}
        scale={0.4}
        key={"Carta-"+carta.id}
        anchor={{ x: 0.4, y: 0.8 }}
        position={{ x: cartas[carta.id].x+20, y: cartas[carta.id].y-30 }}
        zIndex={(IndexCardSelect == carta.id ? zIndex : cartas[carta.id].zIndex)+1}
        angle={carta.rot}
      /> */}
      
    </>
      
    
  ));
};
