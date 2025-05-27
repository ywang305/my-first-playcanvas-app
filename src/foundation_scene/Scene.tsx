import { useState, useMemo } from "react";
import { Entity } from "@playcanvas/react";
import {
  Camera,
  EnvAtlas,
  Render,
  RigidBody,
  Collision,
  Script,
} from "@playcanvas/react/components";
import { useEnvAtlas } from "@playcanvas/react/hooks";
import { OrbitControls } from "@playcanvas/react/scripts";
import defaultScene from "@/assets/georgia_house.json";
import { SceneItem, type SceneItemProps } from "./SceneItem";
import * as pc from "playcanvas";
import { Player } from "./Player";

class StetupPlane extends pc.Script {
  declare setPlaneReady: (value: React.SetStateAction<boolean>) => void;

  update() {
    if (this.entity.collision && this.entity.collision.halfExtents.x < 200) {
      this.entity.collision.halfExtents = new pc.Vec3(12.5, 0.1, 12.5);
      this.setPlaneReady(true);
    }
  }
}

export function Scene() {
  const { asset: envMap } = useEnvAtlas(
    "https://playcanvas-react.vercel.app/environment-map.png"
  );
  const [planeReady, setPlaneRady] = useState(false);


  // const {floors, others} = useMemo(() => {
  //   const items = Object.values(defaultScene.objects) as unknown as SceneItemProps[];
  //   return items.reduce((acc, item) => {
  //     if (/floor/i.test(item.category)) {
  //       (acc.floors as SceneItemProps[]).push(item);
  //     } else {
  //       (acc.others as SceneItemProps[]).push(item);
  //     }
  //     return acc;
  //   }, {floors: [], others: []})
  // }, [])

  return (
    <Entity>
      <Entity name="envAtlas">
        <EnvAtlas asset={envMap!} showSkybox={false} />
      </Entity>

      <Entity name="camera" position={[0, 4, 2]}>
        <Camera />
        <OrbitControls
          inertiaFactor={0.07}
          distanceMin={6}
          distanceMax={100}
          pitchAngleMin={-10}
          pitchAngleMax={90}
        />
      </Entity>
      <Entity position={[0, -0.2, 0]} scale={[25, 1, 25]} name="plane">
        <Collision type="box" halfExtents={new pc.Vec3(12.5, 0.1, 12.5)} />
        <RigidBody type="static" friction={0.9} />
        <Render type="plane" />
        <Script script={StetupPlane} setPlaneReady={setPlaneRady} />
      </Entity>

      { planeReady &&  (
        <>
          {/* {floors.map((item) => {
            const props = item as unknown as SceneItemProps;
            return <Floor key={props.identifier} {...props} />;
          })}
          {others.map((item) => {
            const props = item as unknown as SceneItemProps;
            return <SceneItem key={props.identifier} {...props} />;
          })} */}
          {
            Object.values(defaultScene.objects).map((item) => {
              const props = item as unknown as SceneItemProps;
              return <SceneItem key={props.identifier} {...props} />;
            })
          }
          <Player />
        </>
      )}

    </Entity>
  );
}
