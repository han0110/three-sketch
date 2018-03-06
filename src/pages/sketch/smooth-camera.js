// @flow

import React, { Component } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import { lerp } from '../../components/three/util/Util';
import styles from './template.module.scss';
import Rule from '../../components/Rule';

THREE.Vector3.lerp = lerp;

const V = THREE.Vector3;
const Q = THREE.Quaternion;

class Camera extends THREE.PerspectiveCamera {
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

class SmoothCamera extends Component<{}> {
  canvas: ?HTMLDivElement;
  camera: Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  componentDidMount() {
    this.init();
    this.createLight();
    this.createSphere();
    this.animate();
    window.onresize = this.resize;
    window.onkeypress = this.keypress;
  }

  init = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const [fov, aspect, near, far] = [50, width / height, 1, 5000];
    const initPosition = new THREE.Vector3(0, 0, 0);
    const initTarget = new THREE.Vector3(0, 1, 0);

    this.scene = new THREE.Scene();

    this.camera = new Camera(fov, aspect, near, far);
    this.camera.up.set(0, 0, 1);
    this.camera.moveToTarget(initPosition, initTarget);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);

    if (this.canvas) { this.canvas.appendChild(this.renderer.domElement); }
  }

  createLight = () => {
    const skyColor = new THREE.Color().setHSL(0.7, 1, 0.65);
    const grdColor = new THREE.Color().setHSL(0.6, 1, 0.75);
    const hemiLight = new THREE.HemisphereLight(skyColor, grdColor, 0.8);
    hemiLight.position.set(0, 20, 0);

    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
    shadowLight.position.set(0, 0, 100);
    shadowLight.castShadow = true;

    this.scene.add(hemiLight);
    this.scene.add(shadowLight);
  }

  createSphere = () => {
    const { vertices } = new THREE.IcosahedronGeometry(40, 2);
    const { length } = vertices;

    const geo = new THREE.IcosahedronBufferGeometry(2, 1);
    const mat = new THREE.MeshPhongMaterial({ flatShading: THREE.FlatShading });
    const spheres = new THREE.Group();
    spheres.name = 'spheres';
    spheres.position.set(0, 0, 0);

    for (let i = 0; i < length; i += 1) {
      const { x, y, z } = vertices[i];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      spheres.add(mesh);
    }

    this.scene.add(spheres);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    TWEEN.default.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  keypress = () => {
    const spheres = this.scene.getObjectByName('spheres');
    const target = spheres.children[Math.floor(Math.random() * spheres.children.length)];
    this.camera.moveToTarget(this.camera.position, target.position, true);
  }

  render() {
    const rules = [
      { symbol: '␣', name: 'space', description: 'press space to rotate camera' },
    ];

    return (
      <div ref={(div) => { this.canvas = div; }} className={styles.wrapper}>
        <Rule rules={rules} />
      </div>
    );
  }
}

export default SmoothCamera;
