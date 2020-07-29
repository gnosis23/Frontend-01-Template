import { h, Text, Wrapper } from './createElement';
import {Animation, Timeline} from "./animation";
import {ease} from "./cubicBezier";

export default class Carousel {
  constructor(config) {
    this.children = [];
    this.attrs = [];
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  render() {
    let children = this.data.map(url => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', e => e.preventDefault());
      return element;
    })

    let root = (
      <div class="carousel">
        {children}
      </div>
    )

    let position = 0;

    let timeline = new Timeline();

    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;

      let current = children[position];
      let next = children[nextPosition];

      let currentAnimation = new Animation(
        current.style,
        'transform',
        -100 * position,
        -100 - 100 * position,
        500,
        0,
        ease,
        v => `translateX(${v}%)`
      );
      let nextAnimation = new Animation(
        next.style,
        'transform',
        100 -100 * nextPosition,
        - 100 * nextPosition,
        500,
        0,
        ease,
        v => `translateX(${v}%)`
      );
      timeline.add(currentAnimation);
      timeline.add(nextAnimation);

      timeline.start();

      position = nextPosition;

      setTimeout(nextPic, 3000);
    };

    setTimeout(nextPic, 3000);


    root.addEventListener("mousedown", event => {
      let startX = event.clientX;

      let nextPosition = (position + 1) % this.data.length;
      let lastPosition = (position - 1 + this.data.length) % this.data.length;
      let current = children[position];
      let last = children[lastPosition];
      let next = children[nextPosition];

      current.style.transition = "ease 0s";
      last.style.transition = "ease 0s";
      next.style.transition = "ease 0s";

      current.style.transform = `translateX(${- 500 * position}px)`;
      last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

      let move = event => {
        current.style.transform = `translateX(${- 500 * position - startX + event.clientX}px)`;
        last.style.transform = `translateX(${-500 - 500 * lastPosition - startX + event.clientX}px)`;
        next.style.transform = `translateX(${500 - 500 * nextPosition - startX + event.clientX}px)`;
      };

      let up = event => {
        let offset = 0;

        if (event.clientX - startX > 250) {
          offset = 1;
        } else if (event.clientX - startX < - 250) {
          offset = -1;
        }

        current.style.transition = "";
        last.style.transition = "";
        next.style.transition = "";

        current.style.transform = `translateX(${offset * 500 - 500 * position }px)`;
        last.style.transform = `translateX(${offset * 500 -500 - 500 * lastPosition }px)`;
        next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition }px)`;

        position = (position - offset + this.data.length) % this.data.length;

        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });

    return (
      root
    )
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
