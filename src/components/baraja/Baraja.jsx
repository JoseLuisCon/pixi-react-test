import React, { useEffect, useState, useRef } from "react";
import { initialData } from "../decks/initialData";
import { Sprite, Text, render, useApp } from "@inlet/react-pixi";

import * as PIXI from "pixi.js";
const TWEEN = require("@tweenjs/tween.js");

export const Baraja = ({pos}) => {
  
  const [cartasSprite, setCartasSprite] = useState(initialData);

  const isDragging = useRef(false);
  const isRetorning = useRef(false);
  const initialProps = useRef(null);
  const referenciaSprite = useRef(null);
  const positionPointer = useRef({ x: 0, y: 0 });
  const alpha = useRef(1);
  const app = useApp();

 


  const reDistribution = (arrayIn) => {
    let xBar = pos.x;
    let yBar = pos.y;

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

      xBar = xBar + 50;
      return {
        rot: angle,
        anchor: { x: 0.5, y: 0.7 },
        x: xBar,
        y: yBar,
        ...rest,
      };
    });

    return newCartasSprite;
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
      } else{
        cardsLeft = [...newCartasSprite.slice(0, indexCenter)];
        cardsRight = [...newCartasSprite.slice(indexCenter + 1)];
      }
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

    alpha.current = 1;
    
    return [...newCartasSprite];
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
//* ====================================  FIN EFECTO RETORNO CON LIBRERÍA TWEEN ====================

  const onStart = (e) => {
    if (isRetorning.current) return;

    if (cartasSprite[e.target?.id].zIndex !== cartasSprite.length) return;

    isDragging.current = true;

    initialProps.current = cartasSprite[e.target.id];
    referenciaSprite.current = e.target;
    

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
        positionPointer.current.x > e.target?.x + 30 &&
        positionPointer.current.y < e.target?.y + 100 &&
        positionPointer.current.y > e.target?.y - 200
      ) {
        const checkIdFinal = cartasSprite[cartasSprite.length - 1].id;

        if (checkIdFinal === e.target?.id) return;

        setCartasSprite(showSelectedCard(e.target?.id + 1, cartasSprite));
      } else if (
        positionPointer.current.x < e.target?.x - 30 &&
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
      
                    // DELETING CARDS  //
      
      
      if (cartasSprite.length === 1) {
        setCartasSprite([]);
      
      } else {
 
        // creamos nuevo array de cartas sin la carta que se ha eliminado
        let newCartasSprite = cartasSprite.filter(
          (carta) => carta.id !== initialProps.current.id
        );
    
        // reasignamos los id de las cartas
        newCartasSprite = newCartasSprite.map(({ id, ...props }, index) => {
          const newCart = { id: index, ...props };
          return newCart;
        });

        // recolocamos las cartas
        const newArrayCartasRedistribuidas = reDistribution(
                 newCartasSprite
        );
        
        // Obtenemos el id de la última carta del array
        const chekMaxId =
        newArrayCartasRedistribuidas[newArrayCartasRedistribuidas.length - 1]
        .id;
        
        // comprobamos si la carta que se ha eliminado es la última del array
        if (chekMaxId === initialProps.current.id - 1) {
          // FUNCIONA
          setCartasSprite(
            showSelectedCard(chekMaxId, newArrayCartasRedistribuidas)
          );
        } else {

          // Si no es la última carta del array, seleccionamos la carta con el mismo id que la que se ha eliminado    
          
          // NO FUNCIONA
          const newArray = showSelectedCard(
            initialProps.current.id,
            newArrayCartasRedistribuidas
          )
            
          setCartasSprite(newArray);
          const removeSprite = app.stage.getChildByName(referenciaSprite.current?.name, true);
          const container = removeSprite?.parent;
          container?.removeChild(removeSprite);
          console.log("🚀 ~ file: Baraja.jsx:345 ~ useEffect ~ removeSprite:", removeSprite?.name)
        }
      }
    } else {
      effectReturnCarta();
    }

    alpha.current = 1;
  };

  useEffect(() => {
    if (cartasSprite.length !== 0) {
      const newArray = reDistribution(cartasSprite);
      setCartasSprite(showSelectedCard(0, newArray));
    }
  }, []);

  useEffect(() => {
    if (cartasSprite.length !== 0) {
      render(<Text text={`Número de cartas ${cartasSprite.length}`} y={0} />, app.stage );
      
    }
  }, [cartasSprite.length])


  


  return (
    <>
      {cartasSprite.map(
        ({ id, img, x, y, anchor, zIndex, rot, scale, select }) => (
          <Sprite
            ref={referenciaSprite}
            id={id}
            key={id}
            image={img}
            position={{ x, y: select ? y - 30 : y }}
            angle={rot}
            alpha={initialProps.current?.id === id ? alpha.current : 1}
            anchor={anchor}
            zIndex={zIndex}
            scale={scale}
            interactive={true}
            cursor="pointer"
            pointerdown={onStart}
            pointerup={onEnd}
            // pointerupoutside={onEnd}
            pointermove={onMove}
            name={"carta"+id}
          />
        )
      )}
    </>
  );
};
