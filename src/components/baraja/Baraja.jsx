import React, { useEffect, useState, useRef } from "react";
import { initialData } from "../decks/initialData";
import { Sprite } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";
const TWEEN = require("@tweenjs/tween.js");

export const Baraja = () => {

  const [cartasSprite, setCartasSprite] = useState(initialData);
  

  const isDragging = useRef(false);
  const isRetorning = useRef(false);
  const initialProps = useRef(null);
  const positionPointer = useRef({x:0, y:0});
  const showActive = useRef(true);
  const alpha = useRef(1);
  


  const reDistribution = ({ x, y }) => {
    
    let xBar = x;
    let yBar = y;
    
    let initialAngle = cartasSprite.length === 1 ? 0 : Math.trunc(cartasSprite.length/2) * -2;
    let angle = initialAngle;

    const newCartasSprite = cartasSprite.map((carta, index) => {
      const { zIndex, rot, anchor, x, y, ...rest } = carta;

       if (index === 0) {
         angle = initialAngle;
       } else {
         angle = angle +2;
       }
      xBar = xBar + 60;
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

  const showSelectedCard = (idCarta) => {
    
    
    if (isRetorning.current) return;


      // Se trata de actualizar el estado de las cartas para que se muestren seleccionadas
      // la que se selecciona se eleva y las demás se bajan. Las de la izquierda se bajan hacia la izquierda
      // y las de la derecha hacia la derecha.      
      let newCartasSprite = cartasSprite.slice();

      newCartasSprite[idCarta].select = true;
      newCartasSprite[idCarta].zIndex = cartasSprite.length;
      // Situar las cartas al lado de la seleccionada
      // A ambos lados se situan con un Zindex decreciente
      const zIndexMax = newCartasSprite.length;

      //Dividimos array desde la carta selecionada a izquierda y derecha
      const indexCenter = newCartasSprite.findIndex((carta) => carta.id === idCarta);
      
      let cardsLeft = [];
      let cardsRight=[]

      if (indexCenter !== 0) {
        if (indexCenter === newCartasSprite.length-1){
          cardsLeft = [...newCartasSprite.slice(0, indexCenter)];
          cardsRight = [];
        }
          cardsLeft = [...newCartasSprite.slice(0, indexCenter)];
        cardsRight = [...newCartasSprite.slice(indexCenter+1)];
      } else{
        cardsLeft = [];
        cardsRight = [...newCartasSprite.slice(indexCenter+1)];
      }
        
      
       let numCartsLeft = cardsLeft.length;
       let newZIndex = zIndexMax - numCartsLeft;
       
       for (let index = 0; index < numCartsLeft; index++) {
         
         cardsLeft[index].select = false;
         cardsLeft[index].zIndex = newZIndex;
         newZIndex++;
        }
        
        let numCartsRight = cardsRight.length;
        newZIndex = zIndexMax - 1;
        for (let index = 0; index < numCartsRight; index++) {
          cardsRight[index].select = false;
          cardsRight[index].zIndex = newZIndex;
          newZIndex--;
        }
     
       

      newCartasSprite = [...cardsLeft, newCartasSprite[idCarta], ...cardsRight];
    
      setCartasSprite(newCartasSprite);
    }



   


  

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


  const onStart = (e) => {
    if (isRetorning.current) return;

    isDragging.current = true;

    initialProps.current = cartasSprite[e.target.id];

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
          } else{
            //MANEJO DE LAS CARTAS CUANDO NO SE ENCUENTRAN DRAG AND DROP
            // Recorrido por ellas.
            positionPointer.current = {x:Math.trunc(e.data.global.x),y:Math.trunc(e.data.global.y)};
            
            // Comprobamos si la carta por la que se está moviendo el cursor tiene el zIndex más alto

            if (cartasSprite[e.currentTarget?.id].zIndex !== cartasSprite.length) return;

            // Comprobamos si cursor se encuentra en la parte derecha de la carta, es decir, vamos hacia la derecha    
            if (positionPointer.current.x > e.target?.x+50){
              
              const checkIdFinal = cartasSprite[cartasSprite.length-1].id;
                          
              if (checkIdFinal === e.target?.id) return;
              
              showSelectedCard(e.target?.id + 1);
                      
            } else if (positionPointer.current.x < e.target?.x-50) {
              
              const checkIdInitial = cartasSprite[0].id;
              
              if (checkIdInitial === e.target?.id) return;
              
              showSelectedCard(e.target?.id - 1);
              
              }
               
            }
            
          }
        
        
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
                  showSelectedCard(0);
      reDistribution({ x: 400, y: 500 });
    }
  }, []);

  useEffect(() => {
    if (cartasSprite.length !== 0) {
      showSelectedCard(0);
      reDistribution({ x: 400, y: 500 });
    }
  }, [cartasSprite.length]);

  return (
    <>
      {cartasSprite.map(({ id, img, x, y, anchor, zIndex, rot, scale, select }) => (
        <Sprite
          accessiblePointerEvents="all"
          id={id}
          key={id}
          image={img}
          position={{ x, y: (select) ? y-50 : y }}
          angle={rot}
          alpha={initialProps.current?.id === id ? alpha.current : 1}
          anchor={anchor}
          zIndex={zIndex}
          scale={initialProps.current?.id === id ? scale : {x:0.5, y:0.5}}
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
