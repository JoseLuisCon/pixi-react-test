import { useEffect, useState } from "react";
import { Container, Stage } from "@inlet/react-pixi";
import { CardDragDrop } from "./CardDragAndDrop";
import { CardExplosion } from "./CardExplosion";
import { CardTween } from "./CardTween";
import { Decks } from "./decks/Decks";
import { Decks2 } from "./decks/Decks2";

import { VideoPixi } from "./VideoPixi";
import { VideoPixiRedim } from "./VideoPixi copy";
import { Baraja } from "./baraja/Baraja";
import { NewCarta } from "./baraja/NewCarta";


const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const initialSize = getSize();

const options = {
  backgroundColor: 0x8fd7c5,
  resizeTo: window,
  raf: false,
  autoDensity: true,
};

const mockData =  [ {
    "bg-border":"https://bridder-strapi.s3.eu-central-1.amazonaws.com/border_common_527d95ff75.png",
    "bg-card":"https://bridder-strapi.s3.eu-central-1.amazonaws.com/bg_blue_generic_04ef5399a0.png",
    "rarity":"https://bridder-strapi.s3.eu-central-1.amazonaws.com/frame_common_4d8c56a5b1.png",
    "logo":"https://bridder-strapi.s3.eu-central-1.amazonaws.com/Logo_Suja_1f96e7632f.png",
    "img":"https://bridder-strapi.s3.eu-central-1.amazonaws.com/1_card_34a46d66e3.png",
    "text":"Text Card"
  }
]


/* COMPONENTE QUE SE ADAPTA AL TAMAÑO DE LA PANTALLA */
export const ReSize = ({ x, y }) => {
  
  const [dataBaraja, setDataBaraja] = useState(null);
  



  // POSIBLE SITIO PARA RECIBIR LA DATA (FETCH)
  useEffect(()=>{

    // const mockData = fetch ( https: ...)
      setDataBaraja(mockData);
     
  },[])





  return (
    
      <Stage {...initialSize} options={options}>
       <Container sortableChildren={true} >
         {/* <VideoPixi /> */}
         {/* <VideoPixiRedim /> */}
         {/* <CardExplosion x={900} y={300} />  */}
        
       {/*  <Baraja />  */}
        {/* <CardTween /> */}
        {/* <Decks/> */}
        <Baraja pos={{x:300, y:400}} data={dataBaraja}/>
       
       </Container>
     </Stage>
      
  );
};
