// @flow

import React, { Component } from 'react';
import * as THREE from 'three';
import ThreeMgr from '../../three/threeMrg';

import styles from './template.module.scss';
import Rule from '../../components/Rule';

class Camera extends Component<{}> {
  canvas: HTMLDivElement;
  threeMgr: ThreeMgr;

  componentDidMount() {
    this.init();
    this.createLight();
    this.animate();
  }

  init = () => {
    this.threeMgr = new ThreeMgr();
    this.canvas.appendChild(this.threeMgr.getDom());
  }

  createLight = () => {
    const skyColor = new THREE.Color().setHSL(0.7, 1, 0.65);
    const grdColor = new THREE.Color().setHSL(0.6, 1, 0.75);
    const hemiLight = new THREE.HemisphereLight(skyColor, grdColor, 0.8);
    hemiLight.position.set(0, 20, 0);

    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
    shadowLight.position.set(0, 0, 100);
    shadowLight.castShadow = true;

    this.threeMgr.regObject(hemiLight);
    this.threeMgr.regObject(shadowLight);
  }

  animate = () => this.threeMgr.animate();

  render() {
    const rules = [];

    return (
      <div ref={(div) => { if (div) this.canvas = div; }} className={styles.wrapper}>
        <Rule rules={rules} />
      </div>
    );
  }
}

export default Camera;
