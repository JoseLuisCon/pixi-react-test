import { Container, Stage } from "@inlet/react-pixi";
import { AnimatedSprite, JetSpriteAnimated } from "./AnimatedSprite";
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
  raf:false,
  autoDensity: true
};

export const ReSize = () => {
  

  return (
    <Stage {...initialSize} options={options} >
      <Container sortableChildren={true} auto>
        <JetSpriteAnimated />
        <ButtonsZIndex />
        <CardMove /> 
        <VideoPixi />  
      </Container>
    </Stage>
  );
};
