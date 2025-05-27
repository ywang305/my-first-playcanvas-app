import React, { useMemo } from "react";
import { Entity } from "@playcanvas/react";
import * as pc from "playcanvas";
import { Render, Collision, RigidBody, Script } from "@playcanvas/react/components";
import { useModel } from "@playcanvas/react/hooks";


type Tuple3 = [number, number, number];


export interface SceneItemProps {
  category: string;
  placements: {
    position: Tuple3;
    rotation: Tuple3;
    scale: Tuple3;
  }[];
  bbox_size: Tuple3;
  identifier: string;
  metadata: {
    asset_url: string;
  };
}

export const SceneItem: React.FC<SceneItemProps> = (props) => {
  const { placements, category, metadata } = props;
  const { asset: item } = useModel(metadata.asset_url);
  
  const isFloor = /floor/i.test(category);
  const isWall = /wall/i.test(category);
  const isDoor = /door/i.test(category);
  const isFurniture = /objects/i.test(category);

  const placement = placements[0];

  const position = useMemo<Tuple3>(() => {
    const [x, z, y] = placement.position;
    return [x, y, z];
  }, [placement.position]);
  // const scale: Tuple3 = Array.isArray(placement.scale)
  //   ? placement.scale
  //   : [placement.scale, placement.scale, placement.scale];
  const rigidType = useMemo(() => {
    if(isFloor) {
      return 'static';
    }
    if(isFurniture && !/door|window/i.test(metadata.asset_url) ) {
      return 'dynamic';
    }
    return null;
  }, [isFloor, isFurniture, metadata.asset_url]);

  return item && (
    <Entity
      name={props.identifier}
      position={position}
      rotation={placement.rotation}
      scale={[1, 1, 1]}
    >
      <Collision type="box" halfExtents={new pc.Vec3(0.1, 0, 0.1)}/>
      { rigidType && <RigidBody type={rigidType} mass={1} />}
      <Render type="asset" asset={item} />
    </Entity>
  );
};
