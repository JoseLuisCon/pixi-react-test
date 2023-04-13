import React, { useEffect, useState, useRef } from "react";
import { initialData } from "../decks/initialData";
import { Container, Sprite, useApp } from "@inlet/react-pixi";

const TWEEN = require("@tweenjs/tween.js");

export const Baraja = () => {

  const [cartasSprite, setCartasSprite] = useState(initialData);
  

  const isDragging = useRef(false);
  const isRetorning = useRef(false);
  const initialProps = useRef(null);
  const selectCard = useRef(false);
  const alpha = useRef(1);
  
  const reDistribution = ({ x, y }) => {
    let xBar = x;
    let yBar = y;
    
    let initialAngle = cartasSprite.length === 1 ? 0 : Math.trunc(cartasSprite.length/2) * -3;
    let angle = initialAngle;

    const newCartasSprite = cartasSprite.map((carta, index) => {
      const { zIndex, rot, anchor, x, y, ...rest } = carta;

       if (index === 0) {
         angle = initialAngle;
       } else {
         angle = angle +3;
       }

      xBar = xBar + 50;

      return {
        rot: angle,
        zIndex: cartasSprite.length - index,
        anchor: {x:0.5, y:0.7},
        x: xBar,
        y: yBar,
        ...rest,
      };
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
      .to({ x, y:y }, 1200)
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
        isRetorning.current = true;
      })
      .onComplete(() => {
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


  
  const onOver = (e) => {

    if (isRetorning.current) return;

    console.log("🚀 ~ file: Baraja.jsx:126 ~ onOver ~ cartasSprite:", cartasSprite)
    initialProps.current = cartasSprite[e.currentTarget.id];

     const newCartasSprite = cartasSprite.map((carta) => {
       if (carta.id === e.target.id) {
         let { zIndex,  y, ...props } = carta;
    
         const newCart = {
          y:y-50,
          zIndex: cartasSprite.length,
          ...props,
         };
         return newCart;
       } else {
        return carta;
         
       }
     });
    setCartasSprite(newCartasSprite);

    
  };

 const onOut = (e)=>{
   
    if (isRetorning.current) return;

     const newCartasSprite = cartasSprite.map((carta) => {
       
       if (carta.id === e.currentTarget.id) {
          let { y, zIndex, ...props } = carta;
          const newCart = {
            y: initialProps.current.y,
            zIndex: zIndex - 1,
            ...props,
          };
          return newCart;
        } else {
        
         let { zIndex, ...props } = carta;
        
         const newCart = {
           zIndex: zIndex-1,          
           ...props,
         };
         return newCart;
        }
      });
      setCartasSprite(newCartasSprite);

      
 }




  const onStart = (e) => {
    if (isRetorning.current) return;

    isDragging.current = true;

    // initialProps.current = cartasSprite[e.target.id];

    const newCartasSprite = cartasSprite.map((carta) => {
      if (carta.id === initialProps.current.id) {
        let { x, y, rot, anchor,  ...props } = carta;
        const newCart = {
          rot: 0,
          x: Math.trunc(e.data.global.x),
          y: Math.trunc(e.data.global.y),
          anchor: 0.5,
          // zIndex: 999,
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
      } else {
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
      reDistribution({ x: 600, y: 500 });
    }
  }, []);

  useEffect(() => {
    reDistribution({ x: 600, y: 500 });
  }, [cartasSprite.length]);

  return (
    <>
      {cartasSprite.map(({ id, img, x, y, anchor, zIndex, rot, scale }) => (
        <Sprite
          accessiblePointerEvents="all"
          id={id}
          key={id}
          image={img}
          position={{ x, y }}
          angle={rot}
          alpha={initialProps.current?.id === id ? alpha.current : 1}
          anchor={anchor}
          zIndex={zIndex}
          scale={initialProps.current?.id === id ? scale : {x:0.5, y:0.5}}
          interactive={true}
          cursor="pointer"
          pointerdown={onStart}
          pointerover={onOver}
          pointerout={onOut}
          pointerup={onEnd}
          pointerupoutside={onEnd}
          pointermove={onMove}
        />
      ))}
    </>
  );
};
