import * as THREE from 'three';

function lerpVector(
  pointA: THREE.Vector3,
  pointB: THREE.Vector3,
  normValue: number
): THREE.Vector3 {
  let dir = pointB.clone().sub(pointA);
  const len = dir.length();
  dir = dir.normalize().multiplyScalar(len * normValue);
  return pointA.clone().add(dir);
}

function sinBetween(min: number, max: number, t: number, speed = 1.0): number {
  const halfRange = (max - min) / 2;
  return min + halfRange + Math.sin(speed * t) * halfRange;
}

export { lerpVector, sinBetween };
