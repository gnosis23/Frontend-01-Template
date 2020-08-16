import {enableGesture} from "./gesture";

export function h(Tag, attributes, ...children) {
  let o;

  if (typeof Tag === 'string') {
    o = new Wrapper(Tag);
  } else {
    o = new Tag({
      timer: {}
    });
  }

  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }

  let visit = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new Text(child);
        o.appendChild(child);
      } else if (Array.isArray(child)) {
        visit(child);
      } else {
        o.appendChild(child);
      }
    }
  }

  visit(children);

  return o;
}

export class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Wrapper {
  constructor(tag) {
    this.children = [];
    console.log('create', tag);
    this.root = document.createElement(tag);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);

    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
      this.addEventListener(eventName, value);
    }

    if (name === 'enableGesture') {
      enableGesture(this.root);
    }
  }

  getAttribute(name) {
    return this.root.getAttribute(name) || '';
  }

  appendChild(child) {
    this.children.push(child);
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  get style() {
    return this.root.style;
  }

  get classList() {
    return this.root.classList;
  }

  set innerText(value) {
    this.root.innerText = value;
  }

  mountTo(parent) {
    parent.appendChild(this.root)
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}
