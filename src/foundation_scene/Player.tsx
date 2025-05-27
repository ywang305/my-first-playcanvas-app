import { Entity } from "@playcanvas/react";
import {
  Script,
  Render,
  Collision,
  RigidBody,
} from "@playcanvas/react/components";
import { Script as PcScript } from "playcanvas";
import * as pc from "playcanvas";
import { useModel } from "@playcanvas/react/hooks";
import material from "../assets/survivorFemaleA.png";

class FirstPersonMovement extends PcScript {
  force = new pc.Vec3();
  eulers = new pc.Vec3();
  camera?: pc.Entity;
  readonly power = 2500;
  readonly lookSpeed = 0.25;

  initialize() {
    const app = this.app!;

    if (!app.keyboard) {
      app.keyboard = new pc.Keyboard(window);
    }

    // Listen for mouse move events
    app.mouse!.on("mousemove", this._onMouseMove, this);

    // when the mouse is clicked hide the cursor
    app.mouse!.on(
      "mousedown",
      function () {
        app.mouse!.enablePointerLock();
      },
      this
    );
  }

  update(dt: number) {
    if (!this.entity.rigidbody || this.entity.rigidbody.type !== pc.BODYTYPE_DYNAMIC) {
        return;
    }
    if (!this.entity.collision) {
      return;
    }
    if (!this.camera) {
      this._createCamera();
    }
    const force = this.force!;
    const keyboard = this.app.keyboard!;
    const forward = this.camera!.forward;
    const right = this.camera!.right;

    let x = 0;
    let z = 0;

    if (keyboard.isPressed(pc.KEY_A)) {
      x -= right.x;
      z -= right.z;
    }

    if (keyboard.isPressed(pc.KEY_D)) {
      x += right.x;
      z += right.z;
    }

    if (keyboard.isPressed(pc.KEY_W)) {
      x += forward.x;
      z += forward.z;
    }

    if (keyboard.isPressed(pc.KEY_S)) {
      x -= forward.x;
      z -= forward.z;
    }


    // use direction from keypresses to apply a force to the character
    if (x !== 0 || z !== 0) {
      force.set(x, 0, z).normalize().mulScalar(this.power);
      this.entity.rigidbody.applyForce(force);
      
    }

    // update camera angle from mouse events
    this.camera!.setLocalEulerAngles(this.eulers!.y, this.eulers!.x, 0);
  }

  private _onMouseMove = (e: pc.MouseEvent) => {
    if (e.buttons[0]) {
      this.eulers!.x -= this.lookSpeed * e.dx;
      this.eulers!.y -= this.lookSpeed * e.dy;
    }
  };

  private _createCamera() {
    this.camera = new pc.Entity();
    this.camera.name = "First Person Camera";
    this.camera.addComponent("camera", {
        fov: 75,
    });
    this.entity.addChild(this.camera);
    this.camera.translateLocal(0, 0.5, 0);
  }
}

export const Player = () => {
  const { asset } = useModel("/character.glb");

  return (
    asset && (
      <Entity name="player" position={[0, 1, 0]} >
        <Render type="capsule"/>
        {/* <Render type="asset" asset={asset} materialAsset={material}/> */}
        <RigidBody
          type="dynamic"
          mass={100}
          linearDamping={0.99}
          linearFactor={[1, 1, 1]}
          angularFactor={[0, 0, 0]}
        />
        <Collision type="capsule" radius={0.5} height={2} axis={1}/>
        <Script script={FirstPersonMovement} />
      </Entity>
    )
  );
};
