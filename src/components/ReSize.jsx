import { Container, Stage } from "@inlet/react-pixi";
import { CardExplosion } from "./CardExplosion";

import { VideoPixi } from "./VideoPixi";

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight - 300,
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
      <Container sortableChildren={true}>
        <VideoPixi />
        <CardExplosion x={900} y={300} /> 
      </Container>
    </Stage>
  );
};
