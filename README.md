# stewart-platform-simulator

An npm package for simulating parallel motion mechanisms.

## Install

```bash
npm install stewart-platform-simulator
```

## Usage

```ts
import { Ik, Mechanism, Simulation, Utils } from 'stewart-platform-simulator';

const parameters = new Mechanism.MechanismParameters3Dof();
const mechanism = new Mechanism.Mechanism3Dof(parameters);
const sim = new Simulation.HeadlessSimulation(mechanism);
requestAnimationFrame(() => sim.animateMechanism());

...
// Simulate random sinusoidal motion
sim.setSimulationMode(Simulation.SimulationMode.SIMULATE_MOTION);
...
// Simulate looking at a target position
sim.setSimulationMode(Simulation.SimulationMode.TRACK_TARGET);
sim.setTargetWorldPosition(new THREE.Vector3(...))

...
// Set to idle
sim.setSimulationMode(Simulation.SimulationMode.IDLE);
```
