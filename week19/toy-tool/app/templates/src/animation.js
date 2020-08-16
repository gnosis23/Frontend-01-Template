export class Timeline {
  constructor() {
    this.animations = [];
    this.animaId = null;
    this.state = 'inited';
    this.tick = () => {
      let passedTime = Date.now() - this.startTime;
      let animations = this.animations.filter(animation => !animation.finished);

      for (let animation of animations) {
        let {
          object,
          property,
          template,
          timingFunction,
          delay,
          duration,
          addTime
        } = animation;

        if (passedTime < delay + addTime)
          continue;

        let progression = timingFunction((passedTime - delay - addTime) / duration) // 0-1之间

        if (passedTime > duration + delay + addTime) {
          progression = 1;
          animation.finished = true;
        }

        let value = animation.valueFromProgression(progression);

        object[property] = template(value)
      }

      // if (animations.length) {
      this.animaId = requestAnimationFrame(this.tick);
      // }
    }
  }

  pause() {
    if (this.state !== 'playing')
      return;
    this.state = 'paused';
    this.pauseTime = Date.now();
    cancelAnimationFrame(this.animaId);
  }

  resume() {
    if (this.state !== 'paused')
      return;
    this.state = 'playing';
    this.startTime += (Date.now() - this.pauseTime);
    this.animaId = requestAnimationFrame(this.tick);
  }

  start() {
    if (this.state !== 'inited')
      return;
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  reset() {
    if (this.state === 'playing') {
      this.pause();
    }
    this.animations = [];
    this.animaId = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, addTime) {
    this.animations.push(animation);
    animation.finished = false;
    if (this.state === 'playing') {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0;
    }
  }
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction
  }

  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor(object, property, template, start, end, duration, delay, timingFunction) {
    this.object = object;
    this.property = property;
    this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction
  }

  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    }
  }
}
