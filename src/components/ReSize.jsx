import { Container, Stage } from "@inlet/react-pixi";
import { ButtonsZIndex } from "./ButtonszIndex";

import { CardMove } from "./CardMove";
import { VideoPixi } from "./VideoPixi";



const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const initialSize = getSize();

const options = {
  backgroundColor: 0x616d77,
  resizeTo: window,
  raf:false
 
};

export const ReSize = () => {
  

  return (
    <Stage {...initialSize} options={options} >
      <Container sortableChildren={true} >
        <ButtonsZIndex />
        <CardMove /> 
        <VideoPixi />  
      </Container>
    </Stage>
  );
};
