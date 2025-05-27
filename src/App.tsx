import "./App.css";
import { Application } from "@playcanvas/react";
import { Scene } from "./foundation_scene/Scene";



export default function App() {
  return (
    <Application usePhysics>
      <Scene />
    </Application>
  );
}
