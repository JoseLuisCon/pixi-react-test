import React, { useState, useRef, useEffect } from "react";

import { Sprite, useApp, useTick } from "@inlet/react-pixi";

import { initialData } from "./initialData";




export const Decks = () => {
  const app = useApp();
  const [cartas, setCartas] = useState(initialData);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [IndexCardSelect, setCardIndex] = useState(null);
  const [InitialPosition, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [zIndex, setZIndex] = useState(0);

  const onStart = (e) => {
    isDragging.current = true;
    setCardIndex(e.target.id);
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
    } 
    else {
      effectReturnCarta() 
      setAlpha(1);
      setZIndex(cartas[IndexCardSelect]?.zIndex);
      setCartas([...cartas]);
    }
  };

  const effectReturnCarta = ()=>{
    
    const xInitial = InitialPosition.x
    const yInitial = InitialPosition.y
       
    const desplazamiento = setInterval(()=>{

      if (cartas[IndexCardSelect].x !== xInitial || cartas[IndexCardSelect].y !== yInitial ){
        let { x, y, ...props } = cartas[IndexCardSelect];

        if (x !==xInitial){
            (xInitial < x) 
            ? x = cartas[IndexCardSelect].x - 1
            : x = cartas[IndexCardSelect].x + 1
          }
        if (y !== yInitial){
          (yInitial < y)
            ? y = cartas[IndexCardSelect].y - 1
            : y = cartas[IndexCardSelect].y + 1
        }
          cartas[IndexCardSelect] = {x, y, ...props}
          setCartas([...cartas])
          console.log(cartas[IndexCardSelect]);
      }
      else
      {
        clearInterval(desplazamiento)
      }
    },2)  
 
    };

  

  function onMove(e) {
    if (isDragging.current) {
      let { x, y, ...props } = cartas[IndexCardSelect];

      x = Math.trunc(e.data.global.x - offset.current.x)
      y = Math.trunc(e.data.global.y - offset.current.y)

      cartas[IndexCardSelect] = { x, y, ...props };

      setCartas([...cartas]);

      //* EFECTO DE DESVANECIMIENTO EN DOS PASOS
      // if (
      //   Math.abs(InitialPosition.y - cartas[IndexCardSelect].y) > 200 ||
      //   Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) > 200
      // ){
      //   setAlpha(0.3)
      // }
      // else if (
      //   Math.abs(InitialPosition.y - cartas[IndexCardSelect].y) > 100 ||
      //   Math.abs(InitialPosition.x - cartas[IndexCardSelect].x) > 100
      // ){
      //   setAlpha(0.7)
      // }else{
      //   setAlpha(1);
      // }   
      //* EFECTO DE DESVANECIMIENTO CUANDO SE ALEJA LA CARTA
      setAlpha(1 - ((Math.abs(InitialPosition.y - cartas[IndexCardSelect].y))*.005))
      setAlpha(1 - ((Math.abs(InitialPosition.x - cartas[IndexCardSelect].x))*.005))

      console.log("x ",Math.abs(InitialPosition.x - cartas[IndexCardSelect].x),"y ",Math.abs(InitialPosition.y - cartas[IndexCardSelect].y));
      
    }
  }

 

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
