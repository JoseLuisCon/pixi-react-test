import React, { useEffect, useState, useRef } from "react";
import { initialData } from "../decks/initialData";
import { Container, Sprite, useApp } from "@inlet/react-pixi";

const TWEEN = require("@tweenjs/tween.js");

export const Baraja = () => {
  const [cartasSprite, setCartasSprite] = useState(initialData);

  const isDragging = useRef(false);
  const isRetorning = useRef(false);
  const initialProps = useRef(null);
  const alpha = useRef(1);
  

  const reDistribution = () => {
    let initialAngle = cartasSprite.length === 1 ? 0 : cartasSprite.length * 7;
    let angle = initialAngle;

    const newCartasSprite = cartasSprite.map((carta, index) => {
      const { zIndex, rot, ...rest } = carta;

      if (index === 0) {
        angle = initialAngle;
      } else {
        angle = angle - 15;
      }

      return { rot: angle, zIndex: cartasSprite.length - index, ...rest };
    });

    setCartasSprite(newCartasSprite);
  };

  const deleteCard = () => {
    if (cartasSprite.length === 1) {
      setCartasSprite([]);
    } else {
      let newCartasSprite = cartasSprite.filter(
        (carta) => carta.id !== initialProps.current.id
      );

      newCartasSprite = newCartasSprite.map(({ id, ...props }, index) => {
        const newCart = { id: index, ...props };
        return newCart;
      });
      setCartasSprite(newCartasSprite);
    }
    initialProps.current = null;
  };

  //* ====================================  EFECTO RETORNO CON LIBRERÍA TWEEN ====================

  const initReturn = () => {
    let { x, y, ...props } = initialProps.current;

    const tween = new TWEEN.Tween({
      x: cartasSprite[initialProps.current.id].x,
      y: cartasSprite[initialProps.current.id].y,
    })
      .to({ x, y }, 1500)
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
      })
      .start()
      .onStart(() => {
        console.log("Empieza el regreso");
        isRetorning.current = true;
      })
      .onComplete(() => {
        console.log("Termina el regreso");
        isRetorning.current = false;
        initialProps.current = null;
      });
  };

  const animate = (time) => {
    requestAnimationFrame(animate);
    TWEEN.update(time);
  };
  const effectReturnCarta = () => {
    initReturn();
    animate();
  };
  //* ====================================   FIN  EFECTO RETORNO CON LIBRERÍA TWEEN ====================
  const onStart = (e) => {
    
    if (isRetorning.current) return;

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
          let { x, y, ...props } = carta;
          const newCart = {
            x: Math.trunc(e.data.global.x),
            y: Math.trunc(e.data.global.y),
            ...props,
          };
          return newCart;
        } else {
          return carta;
        }
      });

       // //* EFECTO DE DESVANECIMIENTO EN DOS PASOS
       if (
         Math.abs(
           initialProps.current.y - newCartasSprite[initialProps.current.id].y
         ) > 300 ||
         Math.abs(
           initialProps.current.x - newCartasSprite[initialProps.current.id].x
         ) > 300
       ) {
         alpha.current = 0.5;
       }  else {
         alpha.current = 1;
       }

      setCartasSprite(newCartasSprite);
    }
  };

  const onEnd = () => {
    
    isDragging.current = false;

    if (isRetorning.current) return;

    if (
      Math.abs(
        initialProps.current?.y - cartasSprite[initialProps.current?.id].y
      ) > 300 ||
      Math.abs(
        initialProps.current?.x - cartasSprite[initialProps.current?.id].x
      ) > 300
    ) {
      deleteCard();
    } else {
      effectReturnCarta();
    }
    alpha.current = 1;
 
  };

  useEffect(() => {
    if (cartasSprite.length !== 0) {
      reDistribution();
    }
  }, []);

  useEffect(() => {
    reDistribution();
  }, [cartasSprite.length]);

  return (
  
      <>
        {cartasSprite.map(({ id, img, x, y, anchor, zIndex, rot }) => (
          <Sprite
            id={id}
            key={id}
            image={img}
            position={{ x, y }}
            angle={rot}
            alpha={initialProps.current?.id === id ? alpha.current : 1}
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
      </>
    
  );
};
