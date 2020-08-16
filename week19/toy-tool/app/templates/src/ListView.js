import { h, Text, Wrapper } from './createElement';

export default class ListView {
  constructor(config) {
    this.children = null;
    this.attrs = [];
    this.state = Object.create(null);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  getAttribute(name) {
    return this[name];
  }

  appendChild(child) {
    this.children = child;
  }

  render() {
    let data = this.getAttribute('data');
    return (
      <div className="list-view" style="width:300px;">
        {data.map(this.children)}
      </div>
    )
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
