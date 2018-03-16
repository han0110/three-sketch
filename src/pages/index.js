// @flow

import React, { Component } from 'react';
import * as THREE from 'three';
import ThreeMgr from '../three/threeMrg';

import Wave from '../three/object/Wave';
import styles from './index.module.scss';

class About extends Component<{}> {
  canvas: ?HTMLDivElement;
  threeMgr: ThreeMgr;

  componentDidMount() {
    this.init();
    this.createLight();
    this.createWave();
    this.animate();
  }

  init = () => {
    this.threeMgr = new ThreeMgr();

    this.threeMgr.camera.fov = 70;
    this.threeMgr.camera.updateProjectionMatrix();

    if (this.canvas) { this.canvas.appendChild(this.threeMgr.getDom()); }
  };

  createLight = () => {
    const skyColor = new THREE.Color().setHSL(0.7, 1, 0.65);
    const grdColor = new THREE.Color().setHSL(0.6, 1, 0.75);
    const hemiLight = new THREE.HemisphereLight(skyColor, grdColor, 0.8);
    hemiLight.position.set(0, 0, 20);

    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
    shadowLight.position.set(0, 0, 100);
    shadowLight.castShadow = true;

    this.threeMgr.regObject(hemiLight);
    this.threeMgr.regObject(shadowLight);
  }

  createWave = () => {
    const wave = new Wave(20);
    wave.position.set(0, 40, 0);

    this.threeMgr.regObject(wave);
    this.threeMgr.regAnimation(wave.getAnim());
  }

  animate = () => this.threeMgr.animate();

  render() {
    return (
      <div ref={(div) => { this.canvas = div; }} className={styles.wrapper}>
        <div className={styles.children}>
          <div className={styles.normal}>
            Sketch on playing the awesome package
          </div>
          <div className={styles.large}>
            Three.js
          </div>
        </div>
      </div>
    );
  }
}

export default About;
