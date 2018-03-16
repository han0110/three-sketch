// @flow

import React, { Component } from 'react';
import * as THREE from 'three';
import ThreeMgr from '../../three/threeMrg';

import SmoothCamera from '../../three/object/SmoothCamera';

import styles from './template.module.scss';
import Rule from '../../components/Rule';

class Camera extends Component<{}> {
  canvas: ?HTMLDivElement;
  threeMgr: ThreeMgr;

  componentDidMount() {
    this.init();
    this.createLight();
    this.createSphere();
    this.animate();

    window.onkeypress = this.keypress;
  }

  init = () => {
    this.threeMgr = new ThreeMgr({ PerspectiveCamera: SmoothCamera });
    if (this.canvas) { this.canvas.appendChild(this.threeMgr.getDom()); }
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

    this.threeMgr.regObject(spheres);
  }

  animate = () => this.threeMgr.animate();

  keypress = () => {
    const { scene, camera } = this.threeMgr;

    const spheres = scene.getObjectByName('spheres');
    const target = spheres.children[Math.floor(Math.random() * spheres.children.length)];
    camera.moveToTarget(camera.position, target.position, true);
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

export default Camera;
