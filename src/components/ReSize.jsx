import { Container, Stage } from "@inlet/react-pixi";
import { AnimatedSprite, JetSpriteAnimated } from "./AnimatedSprite";
import { ButtonsZIndex } from "./ButtonszIndex";
import { CardDragDrop } from "./CardDragAndDrop";

import { CardMove } from "./CardMove";
import { VideoPixi } from "./VideoPixi";

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight - 300,
});

const initialSize = getSize();

const options = {
  backgroundColor: 0x616d77,
  resizeTo: window,
  raf: false,
  autoDensity: true,
};

export const ReSize = () => {
  return (
    <Stage {...initialSize} options={options}>
      <Container sortableChildren={true}>
        <JetSpriteAnimated />
        <ButtonsZIndex />
        <CardMove />
        <VideoPixi />
        <CardDragDrop x={150} y={620} />
      </Container>
    </Stage>
  );
};
