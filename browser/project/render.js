/**
 * render
 *
 */
const fs = require('fs');
const Path = require('path');

class SvgViewPort {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.children = [];
  }
  addToCanvas(img, left, top) {
    if (!img.width || !img.height) return;
    img.left = left;
    img.top = top;
    this.children.push(img);
  }
  draw(item) {
    let text = `<rect width="${item.width}" height="${item.height}" fill="${item.color}"`;
    text += ` x="${item.left}" y="${item.top}"`;
    text += ' />\n'
    return text;
  }
  save(path) {
    let text = `<svg version="1.1" width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">\n`;
    this.children.forEach(node => {
      text += this.draw(node);
    });
    text += `</svg>`;
    // console.log(text);
    fs.writeFileSync(Path.join('./build/', path), text);
  }
}

class Rect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.color = '';
  }
  fill(r, g, b) {
    this.color = `rgb(${r},${g},${b})`;
  }
}

function createViewPort(width, height) {
  return new SvgViewPort(width, height);
}

function createImage(width, height) {
  return new Rect(width, height);
}

function render(viewport, element) {
  if (element.style) {
    let img = createImage(element.style.width, element.style.height);

    let color = element.style['backgroundColor'] || 'rgb(0,0,0)';
    color.match(/rgb\((\d+),(\d+),(\d+)\)/);
    img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
    viewport.addToCanvas(img, element.style.left || 0, element.style.top || 0);
  }

  if (element.children) {
    for (let child of element.children){
      render(viewport, child);
    }
  }
}

module.exports = {
  render,
  createViewPort
};
