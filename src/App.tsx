import "./App.css";
import { Application, Entity } from "@playcanvas/react";
import { Camera, Render, Light } from "@playcanvas/react/components";
import { useModel } from "@playcanvas/react/hooks";
import { OrbitControls } from "@playcanvas/react/scripts";

export default function App() {
  const { asset } = useModel("/lamborghini_vision_gt.glb");

  return (
    <Application>
      <Entity name="camera" position={[0, 0, 2]}>
        <Camera />
        <OrbitControls />
        <Entity name="light" rotation={[45, -45, 45]}>
          <Light type="directional" color="orange" />
        </Entity>
      </Entity>
      <Entity name="box" scale={[4, 4, 4]}>
        <Render type="asset" asset={asset!} />
      </Entity>
    </Application>
  );
}
