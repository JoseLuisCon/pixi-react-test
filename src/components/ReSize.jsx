import { Container, Stage } from "@inlet/react-pixi";
import { CardDragDrop } from "./CardDragAndDrop";
import { CardExplosion } from "./CardExplosion";
import { CardTween } from "./CardTween";
import { Decks } from "./decks/Decks";

import { VideoPixi } from "./VideoPixi";
import { VideoPixiRedim } from "./VideoPixi copy";

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
        
       <Decks /> 
       {/* <CardTween /> */}
      </Container>
    </Stage> 
  );
};
