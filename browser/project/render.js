/**
 * render
 *
 */

class ViewPort {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.children = [];
  }
  draw(img, left, top) {
    if (!img.width || !img.height) return;
    img.left = left;
    img.top = top;
    this.children.push(img);
  }
  save(path) {
    console.log(this.children);
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
  return new ViewPort(width, height);
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
    viewport.draw(img, element.style.left || 0, element.style.top || 0);
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
