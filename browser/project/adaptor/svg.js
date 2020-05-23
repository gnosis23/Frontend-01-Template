const fs = require('fs');
const Path = require('path');

class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.attributes = {};
    this.children = [];
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  /**
   * @param {Element} child
   */
  appendChild(child) {
    this.children.push(child);
  }

  stringify(space = '') {
    let text = `${space}<${this.tagName}`;
    const keys = Object.keys(this.attributes);
    for (let i = 0; i < keys.length; i++) {
      text += ` ${keys[i]}="${this.attributes[keys[i]]}"`
    }
    if (this.children.length === 0) {
      text += `/>\n`
    } else {
      text += `>\n`

      for (let i = 0; i < this.children.length; i++) {
        text += this.children[i].stringify('  ' + space)
      }

      text += `${space}</${this.tagName}>\n`;
    }
    return text;
  }
}

class SvgRender {
  constructor(width, height) {
    this.elem = new Element('svg');
    this.elem.setAttribute('width', width);
    this.elem.setAttribute('height', height);
    this.elem.setAttribute('version', 1.1);
    this.elem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  addToCanvas(width, height, left, top, color) {
    if (!width || !height) return;
    const element = new Element('rect');
    element.setAttribute('width', width);
    element.setAttribute('height', height);
    element.setAttribute('x', left);
    element.setAttribute('y', top);
    element.setAttribute('fill', color || 'rgb(0,0,0)');
    this.elem.appendChild(element);
  }
  save(path) {
    const text = this.elem.stringify();
    fs.writeFileSync(Path.join('./build/', path), text);
  }
}


module.exports = SvgRender;
