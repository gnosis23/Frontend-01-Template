import { h, Text, Wrapper } from './createElement';
import {Animation, Timeline} from "./animation";
import {ease} from "./cubicBezier";
import './carousel.css';

export default class Carousel {
  constructor(config) {
    this.children = [];
    this.attrs = [];
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    let position = 0;

    let nextPicStopHandler = null;

    let timeline = new Timeline();

    let children = this.data.map((url, currentPosition) => {
      let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
      let nextPosition = (currentPosition + 1) % this.data.length;

      let offset = 0;

      let onStart = () => {
        timeline.pause();
        clearTimeout(nextPicStopHandler);

        let currentElement = children[currentPosition];

        let currentTransformValue = Number(
          (currentElement.style.transform).match(/translateX\(([\s\S]+)px\)/)[1]
        );
        offset = currentTransformValue + 500 * currentPosition;
      };

      let onPan = event => {
        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let currentTransformValue = -500 * currentPosition + offset;
        let lastTransformValue = -500 - 500 * lastPosition + offset;
        let nextTransformValue = 500 - 500 * nextPosition + offset;

        let dx = event.clientX - event.startX;

        lastElement.style.transform = `translateX(${lastTransformValue + dx}px)`;
        currentElement.style.transform = `translateX(${currentTransformValue + dx}px)`;
        nextElement.style.transform = `translateX(${nextTransformValue + dx}px)`;
      };

      let onPanend = event => {
        let direction = 0;
        let dx = event.clientX - event.startX;

        console.log('flick', event.isFlick);

        if (dx + offset > 250 || dx > 0 && event.isFlick) {
          direction = 1;
        } else if (dx + offset < -250 || dx < 0 && event.isFlick) {
          direction = -1;
        }

        timeline.reset();

        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let lastAnimation = new Animation(
          lastElement.style,
          'transform',
          -500 -500 * lastPosition + offset + dx,
          -500 - 500 * lastPosition + direction * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`
        );
        let currentAnimation = new Animation(
          currentElement.style,
          'transform',
          -500 * currentPosition + offset + dx,
          - 500 * currentPosition + direction * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`
        );
        let nextAnimation = new Animation(
          nextElement.style,
          'transform',
          500 - 500 * nextPosition + offset + dx,
          500 - 500 * nextPosition + direction * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`
        );

        timeline.add(currentAnimation);
        timeline.add(nextAnimation);
        timeline.add(lastAnimation);
        timeline.start();

        position = direction < 0 ? nextPosition : direction > 0 ? lastPosition : currentPosition;
        nextPicStopHandler = setTimeout(nextPic, 3000);
      }

      let element = (
        <img src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGesture={true} />
      );
      element.style.transform = 'translateX(0px)';
      element.addEventListener('dragstart', e => e.preventDefault());
      return element;
    })

    let root = (
      <div class="carousel">
        {children}
      </div>
    )

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
        v => `translateX(${5 * v}px)`
      );
      let nextAnimation = new Animation(
        next.style,
        'transform',
        100 -100 * nextPosition,
        - 100 * nextPosition,
        500,
        0,
        ease,
        v => `translateX(${5 * v}px)`
      );
      timeline.add(currentAnimation);
      timeline.add(nextAnimation);

      timeline.start();

      position = nextPosition;

      nextPicStopHandler = setTimeout(nextPic, 3000);
    };

    nextPicStopHandler = setTimeout(nextPic, 3000);


    return (
      root
    )
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
