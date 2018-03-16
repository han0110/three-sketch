// @flow

import * as THREE from 'three';

const V3 = THREE.Vector3;

const lerp = (vs: V3, ve: V3, vt: V3, t: number) => {
  const x = THREE.Math.lerp(vs.x, ve.x, t);
  const y = THREE.Math.lerp(vs.y, ve.y, t);
  const z = THREE.Math.lerp(vs.z, ve.z, t);

  vt.set(x, y, z);
};

const other = () => {};

export { lerp, other };
