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
  const positionPointer = useRef({ x: 0, y: 0 });
  const alpha = useRef(1);

  const reDistribution = ({ x, y }, arrayIn) => {
    let xBar = x;
    let yBar = y;

    let initialAngle =
    arrayIn.length === 1 ? 0 : Math.trunc(arrayIn.length / 2) * -2;
    let angle = initialAngle;

    const newCartasSprite = arrayIn.map((carta, index) => {
      const { rot, anchor, x, y, ...rest } = carta;

      if (index === 0) {
        angle = initialAngle;
      } else {
        angle = angle + 2;
      }
      xBar = xBar + 60;
      return {
        rot: angle,
        anchor: { x: 0.5, y: 0.7 },
        x: xBar,
        y: yBar,
        ...rest,
      };
    });

    return(newCartasSprite);
  };

  const showSelectedCard = (idCarta = 0, arraySprite) => {
    if (isRetorning.current) return;

    if (!arraySprite) return;
    // Se trata de actualizar el estado de las cartas para que se muestren seleccionadas
    // la que se selecciona se eleva y las demás se bajan. Las de la izquierda se bajan hacia la izquierda
    // y las de la derecha hacia la derecha.
    let newCartasSprite = arraySprite.slice();

    newCartasSprite[idCarta].select = true;
    newCartasSprite[idCarta].zIndex = newCartasSprite.length;

    // A ambos lados se situan con un Zindex decreciente
    const zIndexMax = newCartasSprite.length;

    //Dividimos array desde la carta selecionada a izquierda y derecha
    const indexCenter = newCartasSprite.findIndex(
      (carta) => carta.id === idCarta
    );

    let cardsLeft = [];
    let cardsRight = [];

    if (indexCenter !== 0) {
      if (indexCenter === newCartasSprite.length - 1) {
        cardsLeft = [...newCartasSprite.slice(0, indexCenter)];
        cardsRight = [];
      }
      cardsLeft = [...newCartasSprite.slice(0, indexCenter)];
      cardsRight = [...newCartasSprite.slice(indexCenter + 1)];
    } else {
      cardsLeft = [];
      cardsRight = [...newCartasSprite.slice(indexCenter + 1)];
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

    return newCartasSprite;
  };

  const deleteCard = () => {
    // if (cartasSprite.length === 1) {
    //   setCartasSprite([]);
    // } else {
    //   let newCartasSprite = cartasSprite.filter(
    //     (carta) => carta.id !== initialProps.current.id
    //   );
      
    //   newCartasSprite = newCartasSprite.map(
    //      ({ id,  ...props }, index) => {
    //        const newCart = { id: index, ...props };
    //        return newCart;
    //      }
    //    );

       

    //   setCartasSprite(newCartasSprite);
     
    // }
  };

  //* ====================================  EFECTO RETORNO CON LIBRERÍA TWEEN ====================

  const initReturn = () => {
    let { x, y, ...props } = initialProps.current;

    const tween = new TWEEN.Tween({
      x: cartasSprite[initialProps.current.id].x,
      y: cartasSprite[initialProps.current.id].y,
    })
      .to({ x: x, y: y }, 1200)
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

    if (cartasSprite[e.target?.id].zIndex !== cartasSprite.length) return;

    isDragging.current = true;

    initialProps.current = cartasSprite[e.target.id];

    const newCartasSprite = cartasSprite.map((carta) => {
      if (carta.id === initialProps.current.id) {
        let { x, y, rot, anchor, ...props } = carta;
        const newCart = {
          rot: 0,
          x: Math.trunc(e.data.global.x),
          y: Math.trunc(e.data.global.y),
          anchor: 0.5,
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
    if (isRetorning.current) return;

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
    } else {
      //MANEJO DE LAS CARTAS CUANDO NO SE ENCUENTRAN DRAG AND DROP
      // Recorrido por ellas.
      positionPointer.current = {
        x: Math.trunc(e.data.global.x),
        y: Math.trunc(e.data.global.y),
      };

      // Comprobamos si la carta por la que se está moviendo el cursor tiene el zIndex más alto

      if (cartasSprite[e.currentTarget?.id].zIndex !== cartasSprite.length)
        return;

      // Comprobamos si cursor se encuentra en la parte derecha de la carta, es decir, vamos hacia la derecha
      if (
        positionPointer.current.x > e.target?.x + 50 &&
        positionPointer.current.y < e.target?.y + 100 &&
        positionPointer.current.y > e.target?.y - 200
      ) {
        const checkIdFinal = cartasSprite[cartasSprite.length - 1].id;

        if (checkIdFinal === e.target?.id) return;

        setCartasSprite(showSelectedCard(e.target?.id + 1, cartasSprite));
      } else if (
        positionPointer.current.x < e.target?.x - 50 &&
        positionPointer.current.y < e.target?.y + 100 &&
        positionPointer.current.y > e.target?.y - 200
      ) {
        const checkIdInitial = cartasSprite[0].id;

        if (checkIdInitial === e.target?.id) return;

        setCartasSprite(showSelectedCard(e.target?.id - 1, cartasSprite));
      }
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
      // DELETING CARDS
      console.log(" 🌕 borrando");
      if (cartasSprite.length === 1) {
           setCartasSprite([]);
         } else {
            
           console.log("🚀 ~ file: Baraja.jsx:291 ~ onEnd ~ cartasSprite:", cartasSprite)
           let newCartasSprite = cartasSprite.filter(
             (carta) => carta.id !== initialProps.current.id 
           );
           console.log("🚀 ~ file: Baraja.jsx:289 ~ onEnd ~ newCartasSprite:", newCartasSprite)
          
           newCartasSprite = newCartasSprite.map(
              ({ id,  ...props }, index) => {
                const newCart = { id: index, ...props };
                return newCart;
              }
            );
          
          const newArrayCartasRedistribuidas = reDistribution({x:400, y:500}, newCartasSprite) 
          
          const chekMaxId = newArrayCartasRedistribuidas[newArrayCartasRedistribuidas.length - 1].id;
          if (chekMaxId === initialProps.current.id-1) {
            setCartasSprite(showSelectedCard(chekMaxId, newArrayCartasRedistribuidas));
          } else {
           
            setCartasSprite(showSelectedCard(initialProps.current?.id, newArrayCartasRedistribuidas));
          }
    
        
        }
      
  
    } else {
      effectReturnCarta();
    }
    
    alpha.current = 1;
  };

  useEffect(() => {
    if (cartasSprite.length !== 0) {
      const newArray = reDistribution({ x: 400, y: 500 }, cartasSprite);
      setCartasSprite(showSelectedCard(0, newArray));
      
    }
  }, []);

  
  return (
    <>
      {cartasSprite.map(
        ({ id, img, x, y, anchor, zIndex, rot, scale, select }) => (
          <Sprite
            accessiblePointerEvents="all"
            id={id}
            key={id}
            image={img}
            position={{ x, y: select ? y - 50 : y }}
            angle={rot}
            alpha={initialProps.current?.id === id ? alpha.current : 1}
            anchor={anchor}
            zIndex={zIndex}
            scale={initialProps.current?.id === id ? scale : { x: 0.5, y: 0.5 }}
            interactive={true}
            cursor="pointer"
            pointerdown={onStart}
            pointerup={onEnd}
            pointerupoutside={onEnd}
            pointermove={onMove}
          />
        )
      )}
    </>
  );
};
