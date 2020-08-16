import { h, Text, Wrapper } from './createElement';

export default class TabPanel {
  constructor(config) {
    this.children = [];
    this.attrs = [];
    this.state = Object.create(null);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  select(i) {
    for (let view of this.childViews) {
      view.style.display = 'none';
    }
    this.childViews[i].style.display = '';

    for (let view of this.titleViews) {
      view.classList.remove('selected');
    }
    this.titleViews[i].classList.add('selected');
  }

  render() {
    this.childViews = this.children.map(child => <div style="width:300px;min-height:300px;">{child}</div>)
    this.titleViews = this.children.map((child, i) => {
      return (
        <span
          onClick={() => this.select(i)}
          style="background-color:lightgreen;padding:0 5px;margin:5px;"
        >{child.getAttribute('title')}</span>
      );
    })

    setTimeout(() => this.select(0), 16);
    return (
      <div className="panel" style="border:solid 1px green;width:300px;">
        {this.titleViews}
        <div>
          {this.childViews}
        </div>
      </div>
    )
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
