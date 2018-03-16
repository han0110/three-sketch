// @flow

import React, { Component } from 'react';
import * as THREE from 'three';
import ThreeMgr from '../../three/threeMrg';

import TextTexture from '../../three/texture/TextTexture';

import styles from './template.module.scss';
import Rule from '../../components/Rule';

class Camera extends Component<{}> {
  canvas: HTMLDivElement;
  threeMgr: ThreeMgr;

  componentDidMount() {
    this.init();
    this.createLight();
    this.createTextPanel();
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

  createTextPanel = () => {
    const texture = new TextTexture('T  H  R  E  E\nI  S\nA  W  E  S  O  M  E');
    const geo = new THREE.PlaneGeometry(10, 5);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(1.57, 0, 0);
    mesh.position.set(0, 20, 0);
    this.threeMgr.regObject(mesh);
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
