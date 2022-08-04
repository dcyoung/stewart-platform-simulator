import * as THREE from 'three';
import { Mechanism3Dof } from './Mechanism';

/**
 * A simulation mode for simulations
 */
const enum SimulationMode {
  Idle,
  SimulateMotion,
  TrackTarget,
}

/**
 * A headless simulation for a mechnism
 */
class HeadlessSimulation {
  private _simulationMode: SimulationMode;
  private _lookAtWorldPosition: THREE.Vector3;
  private _scene: THREE.Scene;
  public readonly mechanism: Mechanism3Dof;

  constructor(mechanism: Mechanism3Dof) {
    this.mechanism = mechanism;
    this._simulationMode = SimulationMode.Idle;
    this._lookAtWorldPosition = new THREE.Vector3(0, 0, 0);
    this._scene = new THREE.Scene();
    this._scene.add(this.mechanism);
    this.resetOrientation();
  }

  setSimulationMode(mode: SimulationMode): void {
    this._simulationMode = mode;
  }

  setTargetWorldPosition(v: THREE.Vector3): void {
    this._lookAtWorldPosition.copy(v);
  }

  resetOrientation(): void {
    this.mechanism.setFinalOrientation(0, 0, 0);
  }

  animateMechanism(): void {
    switch (this._simulationMode) {
      case SimulationMode.SimulateMotion:
        this.mechanism.simulateMotion();
        break;
      case SimulationMode.TrackTarget:
        this.mechanism.trackTarget(this._lookAtWorldPosition);
        break;
      case SimulationMode.Idle:
      default:
        break;
    }

    this.mechanism.animate();
  }
}
export { HeadlessSimulation, SimulationMode };
