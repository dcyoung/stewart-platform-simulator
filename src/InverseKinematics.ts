import * as THREE from 'three';
import { linspace } from './Utils';

/**
 * Calculates the servo horn angle for a pitch/roll servos
 * using closed form inverse kinematic solution.
 *
 * @param q - base frame vector pointing to desired end effector (assume z up)
 * @param B - base frame vector pointing to center of servo arm rotation (assume z up)
 * @param a - length of servo arm
 * @param l - distance between the center of servo arm rotation and the desired end effector
 * @param s - length of the connecting rod
 * @param beta - angle of servo horn plane relative to the forward axis of the base
 * @return the calculated servo angle
 */
function calcServoAngle(
  q: THREE.Vector3,
  B: THREE.Vector3,
  a: number,
  s: number,
  beta: number
): number {
  const l = q.distanceTo(B); // dist between the center of servo arm rotation and the desired end effector
  // Compute IK
  const L = Math.pow(l, 2) - (Math.pow(s, 2) - Math.pow(a, 2));
  const M = 2 * a * (q.z - B.z);
  const N =
    2 * a * (Math.cos(beta) * (q.x - B.x) + Math.sin(beta) * (q.y - B.y));

  return (
    Math.asin(L / Math.sqrt(Math.pow(M, 2) + Math.pow(N, 2))) - Math.atan(N / M)
  );
}

/**
 * Calculates the 2 possible sets of joint angles for a 2 joint planar linkage
 * using closed form inverse kinematic solution.
 *
 * @param p - the desired position of the end effector (relative to the linkage origin, ex: servo horn pivot)
 * @param a1 - length of the first linkage arm
 * @param a2 - length of the second linkage arm
 * @return the 2 possible combinations of both joint angles (q1 and q2)
 */
function solveIk2JointPlanar(
  p: THREE.Vector2,
  a1: number,
  a2: number
): Array<{ q1: number; q2: number }> {
  // soln 1
  const results = [];
  let q2 = Math.acos(
    (p.x * p.x + p.y * p.y - a1 * a1 - a2 * a2) / (2 * a1 * a2)
  );

  let q1 =
    Math.atan(p.y / p.x) -
    Math.atan((a2 * Math.sin(q2)) / (a1 + a2 * Math.cos(q2)));
  results.push({ q1: q1, q2: q2 });

  // soln 2
  q2 = -q2;
  q1 =
    Math.atan(p.y / p.x) +
    Math.atan((a2 * Math.sin(q2)) / (a1 + a2 * Math.cos(q2)));
  results.push({ q1: q1, q2: q2 });
  return results;
}

/**
 * Calculates the joint angle for a 2 joint planar linkage where the first joint is
 * constrained in the xy plane, but the second joint is not.
 * Uses an optimization algorithm to converge on an angle w/ low error.
 *
 * @param v - the desired position of the end effector (relative to the linkage origin, ex: servo horn pivot)
 * @param h - length of the first linkage arm (constrained to its xy plane)
 * @param l - length of the second linkage arm (free in 3d space)
 * @return the best guess angle in radians
 */
function solveIk2JointPlanar3d(v: THREE.Vector3, h: number, l: number): number {
  // TODO: Update... this is currently expecting THREE.js like coordinate system for input vector v
  const a = new THREE.Vector3(v.z, v.x, v.y);
  const b = new THREE.Vector3();
  const lTolerance = 0.00001;
  const minAngle = 0;
  const maxAngle = Math.PI;
  let bestAngle = maxAngle - minAngle;
  let searchRange = maxAngle - minAngle;
  let bestError = 1000000;
  let iter = 0;
  while (bestError > lTolerance && iter < 10) {
    for (const theta of linspace(
      Math.max(bestAngle - searchRange / 2, minAngle),
      Math.max(bestAngle + searchRange / 2, maxAngle),
      100,
      false
    )) {
      b.set(h * Math.cos(theta), h * Math.sin(theta), 0);
      const error = Math.abs(l - a.distanceTo(b));
      if (error < bestError) {
        bestAngle = theta;
        bestError = error;
      }
    }
    searchRange /= 4;
    iter += 1;
  }

  return bestAngle;
}

export { calcServoAngle, solveIk2JointPlanar, solveIk2JointPlanar3d };
