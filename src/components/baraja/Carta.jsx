
import { Sprite } from '@inlet/react-pixi'


import React from 'react'

export const Carta = ({id, img, position, name, rot, zIndex, anchor, handleChangeSprite}) => {
  return (
    <Sprite
      id={id}
      key={id}
      image={img}
      interactive={true}
      scale={0.5}
      anchor={anchor}
      // width={540}
      // height={800}
      angle={rot}
      cursor={"pointer"}
      name={name}
      // alpha={indexCardSelect.current == carta.id ? alpha.current : 1}
      position={position}
       zIndex={ zIndex}
       pointerdown={handleChangeSprite}
      // pointerup={onEnd}
      // pointerupoutside={onEnd}
      
    />
  )
}
