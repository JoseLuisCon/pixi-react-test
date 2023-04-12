import React, { useEffect, useState, useRef } from "react";
import { initialData } from "../decks/initialData";
import { Carta } from "./Carta";
import { Container, Sprite, useApp } from "@inlet/react-pixi";

const TWEEN = require("@tweenjs/tween.js");

export const Baraja = () => {
  const [cartasSprite, setCartasSprite] = useState(initialData);

  const isDragging = useRef(false);
  const initialProps = useRef(null);
  const alpha = useRef(1);
  const ReDistribution = () => {
    let initialAngle = cartasSprite.length === 1 ? 0 : cartasSprite.length * 7;
    let rotationProgress = initialAngle;
    const numCartas = cartasSprite.length;
    const newCartasSprite = cartasSprite.map((carta, index) => {
      let { zIndex, rot, ...res } = carta;

      if (index === 0) {
        rot = initialAngle;
      } else {
        rotationProgress = rotationProgress - 15;
        rot = rotationProgress;
      }
      zIndex = numCartas - index;

      const newCarta = { rot, zIndex, ...res };
      return newCarta;
    });

    setCartasSprite(newCartasSprite);
  };

  const deleteCard = () => {

    if (cartasSprite.length === 1) {
      console.log("Solo una carta");
      setCartasSprite([])
    }
    else {

      let newCartasSprite = cartasSprite.filter(
        (carta) => carta.id !== initialProps.current.id
      );
      
      newCartasSprite = newCartasSprite.map(({ id, ...props }, index) => {
        const newCart = { id: index, ...props };
        return { ...newCart };
      });
      console.log("🚀 ~ file: Baraja.jsx:40 ~ deleteCard ~ newCartasSprite:", newCartasSprite)
      setCartasSprite(newCartasSprite);
    } 
  };

  const initReturn = () => {
    let { x, y, ...props } = initialProps.current;

    const tween = new TWEEN.Tween({
      x: cartasSprite[initialProps.current.id].x,
      y: cartasSprite[initialProps.current.id].y,
    })
      .to({ x: initialProps.current.x, y: initialProps.current.y }, 1500)
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(({ x, y }) => {
        const newCartasSprite = cartasSprite.map((carta) => {
          if (carta.id === initialProps.current.id) {
            const newCarta = {
              x: Math.trunc(x),
              y: Math.trunc(y),
              ...props,
            };
            return newCarta;
          } else {
            return carta;
          }
        });

        setCartasSprite(newCartasSprite);
        // console.log(
        //   "🚀 ~ file: Baraja.jsx:78 ~ .onUpdate ~ newCartasSprite:",
        //   newCartasSprite
        // );
      })
      .start(); // Start the tween immediately.
  };

  const animate = (time) => {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  };
  const effectReturnCarta = () => {
    initReturn();
    animate();
  };

  const onStart = (e) => {
    isDragging.current = true;

    initialProps.current = cartasSprite[e.target.id];

    const newCartasSprite = cartasSprite.map((carta) => {
      if (carta.id === initialProps.current.id) {
        let { x, y, rot, anchor, zIndex, ...props } = carta;
        const newCart = {
          rot: 0,
          x: Math.trunc(e.data.global.x),
          y: Math.trunc(e.data.global.y),
          anchor: 0.5,
          zIndex: 999,
          ...props,
        };
        return newCart;
      } else {
        return carta;
      }
    });

    setCartasSprite(newCartasSprite);
  };

  const onMove = (e) => {
    if (isDragging.current) {
      const newCartasSprite = cartasSprite.map((carta) => {
        if (carta.id === initialProps.current.id) {
          let { x, y, rot, ...props } = carta;
          const newCart = {
            rot: 0,
            x: Math.trunc(e.data.global.x),
            y: Math.trunc(e.data.global.y),
            ...props,
          };
          return newCart;
        } else {
          return carta;
        }
      });

      // // //* EFECTO DE DESVANECIMIENTO EN DOS PASOS
      // if (
      //   Math.abs(initialProps.current.y - newCartasSprite[initialProps.current.id].y) >
      //     300 ||
      //   Math.abs(initialProps.current.x - newCartasSprite[initialProps.current.id].x) >
      //     300
      // ) {
      //   alpha.current = 0.3;
      // } else if (
      //   Math.abs(initialProps.current.y - newCartasSprite[initialProps.current.id].y) >
      //     200 ||
      //   Math.abs(initialProps.current.x - newCartasSprite[initialProps.current.id].x) >
      //     200
      // ) {
      //   alpha.current = 0.7;
      // } else {
      //   alpha.current = 1;
      // }

      setCartasSprite(newCartasSprite);
    }
  };
  const onEnd = () => {
    isDragging.current = false;

    if (
      Math.abs(
        initialProps.current.y - cartasSprite[initialProps.current.id].y
      ) > 300 ||
      Math.abs(
        initialProps.current.x - cartasSprite[initialProps.current.id].x
      ) > 300
    ) {
      console.log("Borrando");
      deleteCard();
    } else {

      effectReturnCarta();
    }

    ReDistribution();
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

  useEffect(() => {
    if (cartasSprite.length !== 0) {
      ReDistribution();
    }
  }, []);
  useEffect(() => {
    if (cartasSprite.length !== 0) {
      ReDistribution();
    }
  }, [cartasSprite.length]);

  return (
    <>
      <Container sortableChildren={true} name="ContainerBaraja">
        {cartasSprite.map(({ id, img, x, y, anchor, zIndex, rot }) => (
          <Sprite
            id={id}
            key={id}
            image={img}
            position={{ x, y }}
            angle={rot}
            anchor={anchor}
            zIndex={zIndex}
            scale={0.5}
            interactive={true}
            cursor="pointer"
            pointerdown={onStart}
            pointerup={onEnd}
            pointerupoutside={onEnd}
            pointermove={onMove}
          />
        ))}
      </Container>
    </>
  );
};
