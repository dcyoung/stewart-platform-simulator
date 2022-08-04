import * as THREE from 'three';
import { Mechanism, Simulation, Utils } from '../src';

describe('index', () => {
  describe('mechanism', () => {
    describe('Mechanism3Dof', () => {
      it('Calculated IK should respect physical properties.', () => {
        const parameters = new Mechanism.MechanismParameters3Dof();
        const mechanism = new Mechanism.Mechanism3Dof(parameters);

        expect(mechanism.getConnectingRodLength_Left()).toBeCloseTo(
          parameters.length_connecting_rod_pitch_roll,
          1
        );
        expect(mechanism.getConnectingRodLength_Right()).toBeCloseTo(
          parameters.length_connecting_rod_pitch_roll,
          1
        );

        const sim = new Simulation.HeadlessSimulation(mechanism);
        sim.setSimulationMode(Simulation.SimulationMode.SIMULATED_MOTION);

        expect(mechanism.getConnectingRodLength_Left()).toBeCloseTo(
          parameters.length_connecting_rod_pitch_roll,
          1
        );
        expect(mechanism.getConnectingRodLength_Right()).toBeCloseTo(
          parameters.length_connecting_rod_pitch_roll,
          1
        );
      });
    });
  });
});

describe('index', () => {
  describe('utils', () => {
    describe('lerpVector', () => {
      it('should properly lerp between vectors', () => {
        const expected = new THREE.Vector3(0, 0, 0.5);
        const result = Utils.lerpVector(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 1),
          0.5
        );
        expect(result.equals(expected)).toEqual(true);
      });
    });
  });
});

describe('index', () => {
  describe('utils', () => {
    describe('sinBetween', () => {
      it('should properly sin between values', () => {
        const expected = 0.9207354924039483;
        const result = Utils.sinBetween(0, 1, 1, 1);
        expect(result).toBeCloseTo(expected);
      });
    });
  });
});
