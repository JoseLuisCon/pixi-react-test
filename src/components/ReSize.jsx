import { Stage } from "@inlet/react-pixi";


import { ContainerMovible } from "./ContainerMovible";

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});
console.log(getSize());
const initialSize = getSize();

const options = {
  backgroundColor: 0x007f8c,
  resizeTo: window,
  raf: false,
  autoDensity: true,
  x:0,
  y:0,
  

};

export const ReSize = () => {

  return (
    <Stage {...initialSize} options={options} >
      {/* PASAMOS POSICIÓN DEL CONTENEDOR DENTRO DEL CANVAS*/}
      <ContainerMovible  position={{x:350,y:250}} />
      
    </Stage>
  );
};
