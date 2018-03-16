// @flow

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { lerp } from '../../three/util/Util';

THREE.Vector3.lerp = lerp;

const V = THREE.Vector3;
const Q = THREE.Quaternion;

class SmoothCamera extends THREE.PerspectiveCamera {
  // extends member for smooth move
  start: { position: V, quaternion: Q };
  end: { position: V, quaternion: Q };
  param: { t: number };
  anim: TWEEN.Tween;

  constructor(fov: number, aspect: number, near: number, far: number) {
    super(fov, aspect, near, far);

    this.start = { position: new V(0, 0, 0), quaternion: new Q(0, 0, 0) };
    this.end = { position: new V(0, 0, 0), quaternion: new Q(0, 0, 0) };
    this.param = { t: 0 };
    this.anim = TWEEN.Tween();
  }

  moveToTarget = (position: V, target: V, animation: boolean = false) => {
    const quaternion = this._getQuaternion(position, target);

    this.start.position = new V().copy(this.position);
    this.start.quaternion = new Q().copy(this.quaternion);
    this.end = { position, quaternion };
    this.param = { t: 0 };

    if (animation) {
      this.anim = new TWEEN.Tween(this.param).to({ t: 1.0 }, 1000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(this._onAnimUpdate)
        .start();
    } else {
      this.position.set(position.x, position.y, position.z);
      this.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }
  }

  _onAnimUpdate = () => {
    const [s, e, t] = [this.start, this.end, this.param.t];
    V.lerp(s.position, e.position, this.position, t);
    Q.slerp(s.quaternion, e.quaternion, this.quaternion, t);
  }

  _getQuaternion = (position: V, target: V) => {
    const oriPos = new V().copy(this.position);
    const oriQua = new Q().copy(this.quaternion);

    this.position.set(position.x, position.y, position.z);
    this.lookAt(target);
    const quaternion = new Q().copy(this.quaternion);

    this.position.set(oriPos.x, oriPos.y, oriPos.z);
    this.quaternion.set(oriQua.x, oriQua.y, oriQua.z, oriQua.w);

    return quaternion;
  }
}

export default SmoothCamera;
