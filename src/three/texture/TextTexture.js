// @flow

import * as THREE from 'three';

class TextTexture extends THREE.Texture {
  constructor(text: string, options: Object = {}) {
    const para = Object.assign({
      size: 100,
      font: 'Futura, Trebuchet MS, Arial, sans-serif',
      style: '',
      fillStyle: 'rgba(200, 200, 200, 1)',
      textAlign: 'center',
      textBaseline: 'top',
      lineSpacing: 60,
    }, options);

    const words = text.split('\n');
    const wordsCount = words.length;

    for (let i = 0; i < wordsCount; i += 1) words[i] = words[i].replace(/^\s+|\s+$/g, '');

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const font = `${para.style} ${para.size}px ${para.font}`;
    context.font = font;

    const lineHeight = para.size + para.lineSpacing;
    const width = Math.max(...words.map(w => context.measureText(w).width)) + 20;
    const height = (lineHeight * wordsCount) + 20;

    Object.assign(canvas, { width, height });
    Object.assign(context, { ...para, font });

    for (let i = 0; i < wordsCount; i += 1) {
      context.fillText(words[i], canvas.width / 2, lineHeight * i);
    }

    super(canvas);
    this.needsUpdate = true;
  }
}

export default TextTexture;
