// @flow

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

class ThreeMgr {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  object: Array<{}>;
  animation: Array<{}>;

  constructor(shadow: Object = {}) {
    this.init(shadow);

    window.onresize = this.resize;
  }

  shadow = (shadow: Object) => Object.assign(THREE, { ...shadow })

  init = (shadow: Object) => {
    this.shadow(shadow);
    this.object = [];
    this.animation = [];

    const { innerWidth: width, innerHeight: height } = window;
    const [fov, aspect, near, far] = [50, width / height, 1, 5000];

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, 0);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(new THREE.Vector3(0, 1, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
  }

  regObject = (obj: Object) => {
    this.scene.add(obj);
    this.object.push(obj);
  }

  regAnimation = (ani: Object) => {
    this.animation.push(ani);
    ani.start();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    TWEEN.default.update();
    this.renderer.render(this.scene, this.camera);
  }

  getDom = () => this.renderer.domElement;

  resize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

export default ThreeMgr;
