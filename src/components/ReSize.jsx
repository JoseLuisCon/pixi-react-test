import { Container, Stage } from "@inlet/react-pixi";
import { CardDragDrop } from "./CardDragAndDrop";
import { CardExplosion } from "./CardExplosion";
import { CardTween } from "./CardTween";
import { Decks } from "./decks/Decks";
import { Decks2 } from "./decks/Decks2";

import { VideoPixi } from "./VideoPixi";
import { VideoPixiRedim } from "./VideoPixi copy";
import { Baraja } from "./baraja/Baraja";


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

export const ReSize = ({ x, y }) => {
   /* COMPONENTE QUE SE ADAPTA AL TAMAÑO DE LA PANTALLA */

  return (
    
      <Stage {...initialSize} options={options}>
       <Container sortableChildren={true} >
         {/* <VideoPixi /> */}
         {/* <VideoPixiRedim /> */}
         {/* <CardExplosion x={900} y={300} />  */}
        
       {/*  <Baraja />  */}
        {/* <CardTween /> */}
        {/* <Decks/> */}
          <Baraja />
       </Container>
     </Stage> 
  );
};
