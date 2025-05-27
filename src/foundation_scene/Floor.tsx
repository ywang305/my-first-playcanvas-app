import { Entity } from "@playcanvas/react";
import {
  Script,
  Render,
  RigidBody,
  Collision,
} from "@playcanvas/react/components";
import { Script as PcScript } from "playcanvas";
import * as pc from "playcanvas";
import { useModel } from "@playcanvas/react/hooks";

class Stetup extends PcScript {
    update() {
        if( this.entity.collision && this.entity.collision.halfExtents.x < 100) {
          console.log('setup collision for floor')
            this.entity.collision.halfExtents = new pc.Vec3(100, 0.1, 100)
        }
    }
}

interface FloorItemProps {
    metadata: {
        asset_url: string;
    };
}


export const Floor: React.FC<FloorItemProps>  = (props) => {
  const { metadata } = props;
  const { asset: floor } = useModel(metadata.asset_url);

  return (
    <Entity position={[0, 0, 0]} name="plane">
      <Collision type="box" halfExtents={new pc.Vec3(200, 0.1, 200)} />
      <RigidBody type="static" friction={0.9} />
      <Render type="asset" asset={floor!} />
      <Script script={Stetup} />
    </Entity>
  );
};
