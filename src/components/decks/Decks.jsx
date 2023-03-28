import { Sprite, useApp, useTick } from "@inlet/react-pixi";
import React, { useState, useRef, useEffect } from "react";

const size = {
  with: window.innerWidth / 2,
  height: window.innerHeight / 2,
};

let initialData = [
  {
    id: 0,
    name: "carta1",
    img: "img/Carta_001.PNG",
    x: size.with - 100,
    y: size.height + 150,
    rot: 15,
    zIndex: 4,
  },
  {
    id: 1,
    name: "carta2",
    img: "img/Carta_002.PNG",
    x: size.with - 100,
    y: size.height + 150,
    rot: 0,
    zIndex: 3,
  },
  {
    id: 2,
    name: "carta1",
    img: "img/Carta_001.PNG",
    x: size.with - 100,
    y: size.height + 150,
    rot: -15,
    zIndex: 2,
  },
  {
    id: 3,
    name: "carta2",
    img: "img/Carta_002.PNG",
    x: size.with - 100,
    y: size.height + 150,
    rot: -30,
    zIndex: 1,
  },
];

export const Decks = () => {
  const app = useApp();

  const [cartas, setCartas] = useState(initialData);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [IndexCardSelect, setIndex] = useState(null);
  const [InitialPosition, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [zIndex, setZIndex] = useState(0);

  const onStart = (e) => {
    isDragging.current = true;

    setIndex(e.target.id);
    offset.current = {
      x: e.data.global.x - cartas[e.target.id]?.x,
      y: e.data.global.y - cartas[e.target.id]?.y,
    };

    setPosition({ x: cartas[e.target.id].x, y: cartas[e.target.id].y });

    setZIndex(999);
  };

  const deleteCard = () => {
    let newArray = cartas.filter((carta) => carta.id !== IndexCardSelect);
    newArray = newArray.map(({ id, ...props }, index) => {
      return { id: index, ...props };
    });
    setCartas([...newArray]);
  };

  const onEnd = () => {
    isDragging.current = false;

    let { x, y, ...props } = cartas[IndexCardSelect];

    if (
      Math.abs(InitialPosition.y - y) > 200 ||
      Math.abs(InitialPosition.x - x) > 200
    ) {
      deleteCard();
    } else {
      x = InitialPosition.x;
      y = InitialPosition.y;
      cartas[IndexCardSelect] = { x, y, ...props };
      setAlpha(1);
      setZIndex(cartas[IndexCardSelect]?.zIndex);
      setCartas([...cartas]);
    }
  };

  function onMove(e) {
    if (isDragging.current) {
      let { x, y, ...props } = cartas[IndexCardSelect];

      x = e.data.global.x - offset.current.x;
      y = e.data.global.y - offset.current.y;

      cartas[IndexCardSelect] = { x, y, ...props };

      setCartas([...cartas]);
      if (
        Math.abs(InitialPosition.y - cartas[IndexCardSelect].y) > 200 ||
        Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) > 200
      ){
        setAlpha(0.3)
      }
      else if (
        Math.abs(InitialPosition.y - cartas[IndexCardSelect].y) > 100 ||
        Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) > 100
      ){
        setAlpha(0.7)
      }else{
        setAlpha(1);
      }       
    }
  }

  useTick((delta) => {
    //  setRotation(i => i + 0.0001)
  });

  return cartas.map((carta, index) => (
    <Sprite
      id={carta.id}
      key={index}
      image={carta.img}
      interactive
      scale={0.5}
      anchor={{ x: 0.4, y: 0.8 }}
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
  ));
};
