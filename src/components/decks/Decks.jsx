import React, { useState, useRef, useEffect } from "react";

import { Container, Sprite, useApp, useTick } from "@inlet/react-pixi";

import { initialData } from "./initialData";

import * as PIXI from "pixi.js";

const TWEEN = require("@tweenjs/tween.js");
const cartaImg = "img/Carta_001.PNG";
const texture = PIXI.Texture.from(cartaImg);

export const Decks = () => {
  const app = useApp();
  const [zIndex, setZIndex] = useState(0);
  const [cartas, setCartas] = useState(initialData);

  const angleInitial = useRef(null);
  const isDragging = useRef(false);
  const indexCardSelect = useRef(null);
  const initialPosition = useRef({x: 0, y: 0})
  const alpha = useRef(1);
 

  const onStart = (e) => {

    console.log("onStart", cartas);
    isDragging.current = true;

    indexCardSelect.current = e.target.id;    
    angleInitial.current=cartas[e.target.id].rot;
    initialPosition.current = {x: cartas[e.target.id].x, y: cartas[e.target.id].y}
    
    let { x, y, rot, anchor, ...props } = cartas[indexCardSelect.current];
    const newCart = {
      rot: 0,
      x: Math.trunc(e.data.global.x),
      y: Math.trunc(e.data.global.y),
      anchor: 0.5,
      ...props
    };
    
    cartas[indexCardSelect.current] = {...newCart};
    setCartas([...cartas]);
    setZIndex(999);
   
  };



  const deleteCard = () => {
    
    let newArray = cartas.filter((carta) => carta.id !== indexCardSelect.current);
    
    newArray = newArray.map(({ id,  ...props }, index) => {
        const newCart = { id: index,  ...props}
      return { ...newCart }
      }
      );
    setCartas([...newArray]);
  };

  const onEnd = () => {


    console.log("onEnd",cartas);
    isDragging.current = false;

    let { x, y, rot, anchor, ...props } = cartas[indexCardSelect.current];
    let desplazY = (Math.abs(initialPosition.current.y - y))
    let desplazX = (Math.abs(initialPosition.current.x - x))
    
    if (
       Math.abs(initialPosition.current.y - y) > 300 ||
       Math.abs(initialPosition.current.x - x) > 300
       
       ) {
      console.log("🚀 ~ file: Decks.jsx:69 ~ onEnd ~ initialPosition.current:", initialPosition.current)
      //effectDisaperCard();
      deleteCard();
    } else {
      
      if (desplazX && desplazY){

        console.log("🚀 ~ file: Decks.jsx:69 ~ onEnd ~ initialPosition.current:", initialPosition.current)
        const newCarta = { x, y, rot: angleInitial.current, anchor: { x: 0.4, y: 0.8 }, ...props };
        cartas[indexCardSelect.current] = {...newCarta};
        setCartas([...cartas]);
        effectReturnCarta();
        alpha.current= 1;
      
        setZIndex(cartas[indexCardSelect.current]?.zIndex);
      }
      
    }
  };

  const initReturn = () => {
    let { x, y, ...props } = cartas[indexCardSelect.current];

    const tween = new TWEEN.Tween({
      x: cartas[indexCardSelect.current].x,
      y: cartas[indexCardSelect.current].y,
    })
      .to({ x: initialPosition.current.x, y: initialPosition.current.y }, 1500)

      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(({ x, y }) => {
        cartas[indexCardSelect.current] = { x: Math.trunc(x) , y: Math.trunc(y), ...props };

        setCartas([...cartas]);
      })
      .start(); // Start the tween immediately.
  };



  const effectReturnCarta = () => {
    initReturn();
    animate();
  };
  // const effectDisaperCard = ()=>{
  //   initDisapear();
  //   animate();
  // }

  function onMove(e) {
    // console.log("🚀 ~ file: Decks.jsx:107 ~ onMove ~ e:", e)
    if (isDragging.current) {
      
      
      let { x, y, ...props } = cartas[indexCardSelect.current];
      x = Math.trunc(e.data.global.x);
      y = Math.trunc(e.data.global.y);

      cartas[indexCardSelect.current] = { x, y, ...props };

      setCartas([...cartas]);

      // //* EFECTO DE DESVANECIMIENTO EN DOS PASOS
        if (
          Math.abs(initialPosition.current.y - cartas[indexCardSelect.current].y) > 300 ||
          Math.abs(initialPosition.current.x - cartas[indexCardSelect.current].x) > 300
        ){
          alpha.current=0.3;
        }
        else if (
          Math.abs(initialPosition.current.y - cartas[indexCardSelect.current].y) > 200 ||
          Math.abs(initialPosition.current.x - cartas[indexCardSelect.current].x) > 200
        ){
          alpha.current=0.7;
        }else{
          alpha.current=1;
        }
      //* EFECTO DE DESVANECIMIENTO CUANDO SE ALEJA LA CARTA
      // setAlpha(
      //   1 - Math.abs(InitialPosition.y - cartas[IndexCardSelect.current].y) * 0.006 || 1 - Math.abs(InitialPosition.x - cartas[IndexCardSelect.current].x) * 0.006
      // );
      // setAlpha(
      //   1 - Math.abs(InitialPosition.x - cartas[IndexCardSelect.current].x) * 0.006
      // );
    }
  }

  const setDistribution = () => {
    let initialAngle = cartas.length === 1 ? 0 : cartas.length * 5;
    let rotationProgress = initialAngle;

    const newCards = cartas.map((carta, index) => {
      let { rot, zIndex, ...props } = carta;
      if (carta.id === 0) {
        rot = initialAngle;
      } else {
        rotationProgress = rotationProgress - 10;
        rot = rotationProgress;
      }
      zIndex = cartas.length - index;
      const newCarta = { rot, zIndex, ...props };
      return { ...newCarta };
    });

    setCartas([...newCards]);
  };

  useEffect(() => {
    setDistribution();
  }, [cartas.length]);
  useEffect(() => {
    setDistribution();
  }, []);

  const animate = (time) => {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  };

  return cartas.map((carta, index) => (
    <>
      <Sprite
        id={carta.id}
        key={index}
        image={carta.img}
        interactive
        scale={0.5}
        anchor={ carta.anchor }
        // width={540}
        // height={800}
        angle={carta.rot}
        cursor={"pointer"}
        name={carta.name}
        alpha={indexCardSelect.current == carta.id ? alpha.current : 1}
        position={{ x: cartas[carta.id].x, y: cartas[carta.id].y }}
        zIndex={indexCardSelect.current == carta.id ? zIndex : cartas[carta.id].zIndex}
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
        zIndex={(IndexCardSelect.current == carta.id ? zIndex : cartas[carta.id].zIndex)+1}
        angle={carta.rot}
      /> */}
    </>
  ));
};
