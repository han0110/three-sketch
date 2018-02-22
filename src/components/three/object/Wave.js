// @flow

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

class Wave extends THREE.Group {
  constructor(radius: number) {
    super();

    const geo = new THREE.IcosahedronGeometry(radius, 2);
    const mat = new THREE.MeshPhongMaterial({ flatShading: THREE.FlatShading });
    this.mesh = new THREE.Mesh(geo, mat);
    this.add(this.mesh);

    this.waves = [];
    this.anim = TWEEN.Tween();
    this.param = { t: 0 };
  }

  createWave = () => {
    const { geometry } = this.mesh;
    const { length } = geometry.vertices;

    for (let i = 0; i < length; i += 1) {
      const v = geometry.vertices[i];
      this.waves.push({
        origin: new THREE.Vector3().copy(v),
        normal: new THREE.Vector3().copy(v).sub(this.position).normalize(),
        ang: Math.random() * Math.PI * 2,
        amp: 0.2 + (Math.random() * 0.4),
      });
    }
  }

  animate = () => {
    this.anim = new TWEEN.Tween(this.param).to({ t: Math.PI * 2 }, 3000)
      .onUpdate(this._onUpdate)
      .repeat(Infinity)
      .start();
  }

  _onUpdate = () => {
    const { geometry } = this.mesh;
    const { length } = geometry.vertices;

    for (let i = 0; i < length; i += 1) {
      // eslint-disable-next-line object-curly-newline
      const { origin, normal, ang, amp } = this.waves[i];
      const { t } = this.param;
      const delta = new THREE.Vector3().addScaledVector(normal, Math.cos(ang + t) * amp);
      geometry.vertices[i].set(origin.x + delta.x, origin.y + delta.y, origin.z + delta.z);
    }

    geometry.verticesNeedUpdate = true;
  }
}

export default Wave;
