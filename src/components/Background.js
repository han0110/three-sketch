// @flow

import React, { Component } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import type { Node } from 'react';

import Wave from './three/object/Wave';
import styles from './Background.module.scss';

type Props = {
  children: Node,
};

class Background extends Component<Props> {
  canvas: ?HTMLDivElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  componentDidMount() {
    this.init();
    this.createLight();
    this.createWave();
    this.animate();

    window.onresize = this.resize;
  }

  init = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const [fov, aspect, near, far] = [70, width / height, 1, 5000];

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, 0);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(new THREE.Vector3(0, 1, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);

    if (this.canvas) { this.canvas.appendChild(this.renderer.domElement); }
  };

  createLight = () => {
    const skyColor = new THREE.Color().setHSL(0.7, 1, 0.65);
    const grdColor = new THREE.Color().setHSL(0.6, 1, 0.75);
    const hemiLight = new THREE.HemisphereLight(skyColor, grdColor, 0.8);
    hemiLight.position.set(0, 0, 20);

    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
    shadowLight.position.set(0, 0, 100);
    shadowLight.castShadow = true;

    this.scene.add(hemiLight);
    this.scene.add(shadowLight);
  }

  createWave = () => {
    const wave = new Wave(20);
    wave.mesh.position.set(0, 40, 0);
    wave.createWave();
    wave.animate();
    this.scene.add(wave.mesh);
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
      <div ref={(div) => { this.canvas = div; }} className={styles.wrapper}>
        <div className={styles.children}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Background;

