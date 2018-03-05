// @flow

import React, { Component } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import styles from './template.module.scss';

class Three extends Component<{}> {
  canvas: ?HTMLDivElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  async componentDidMount() {
    await this.init();
    this.animate();
    window.onresize = this.resize;
  }

  init = async () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const [fov, aspect, near, far] = [50, width / height, 1, 5000];
    const initPosition = new THREE.Vector3(0, 0, 0);
    const initTarget = new THREE.Vector3(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x959CD5);

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.up.set(0, 0, 1);
    this.camera.moveToTarget(initPosition, initTarget);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);

    if (this.canvas) { this.canvas.appendChild(this.renderer.domElement); }
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

  render() {
    return (
      <div
        className={styles.wrapper}
        ref={(div) => { this.canvas = div; }}
      />
    );
  }
}


export default Three;
