export function enableGesture(element) {
  function InnerEvent(name, params) {
    return Object.assign(new CustomEvent(name), params);
  }

  let contexts = Object.create(null);

  let MOUSE_SYMBOL = Symbol("mouse");

  element.addEventListener('mousedown', (event) => {
    contexts[MOUSE_SYMBOL] = Object.create(null);
    start(event, contexts[MOUSE_SYMBOL]);
    let mousemove = event => {
      move(event, contexts[MOUSE_SYMBOL]);
    };
    let mouseend = event => {
      end(event, contexts[MOUSE_SYMBOL]);
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseend);
    };
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseend);
  });

  element.addEventListener('touchstart', event => {
    for (let touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener('touchmove', event => {
    for (let touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener('touchend', event => {
    for (let touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }

  });

  element.addEventListener('touchcancel', event => {
    for (let touch of event.changedTouches) {
      cancel(touch, touch.identifier);
      delete contexts[touch.identifier];
    }
  });


// tap
// pan - panstart panmove panend
// flick
// press - pressstart pressend

  let start = (point, context) => {
    element.dispatchEvent(new InnerEvent('start', {
      startX: point.clientX,
      startY: point.clientY,
      clientX: point.clientX,
      clientY: point.clientY
    }));
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.timeoutHandler = setTimeout(() => {
      if (context.isPan)
        return;

      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(new InnerEvent('pressstart', {}));
    }, 500);
  };

  let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;

    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress){
        element.dispatchEvent(new InnerEvent('presscancel', {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;

      element.dispatchEvent(new InnerEvent('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      }));
    }

    if (context.isPan) {
      context.moves.push({
        dx, dy,
        t: Date.now()
      });
      context.moves = context.moves.filter(record => Date.now() - record.t < 300);
      element.dispatchEvent(new InnerEvent('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      }));
    }

    // console.log('move', dx, dy);
  };

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
      let record = context.moves[0];
      let speed = Math.sqrt(((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t));
      // console.log(speed);
      let isFlick = speed > 2.5;
      if (isFlick) {
        element.dispatchEvent(new InnerEvent('flick', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed: speed
        }));
      }
      element.dispatchEvent(new InnerEvent('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed: speed,
        isFlick: isFlick
      }));
    }

    if (context.isTap) {
      element.dispatchEvent(new InnerEvent('tap', {}))
    }

    if (context.isPress) {
      element.dispatchEvent(new InnerEvent('pressend', {}))
    }

    clearTimeout(context.timeoutHandler);
  };

  let cancel = (point, context) => {
    element.dispatchEvent(new InnerEvent('canceled', {}))
    clearTimeout(context.timeoutHandler);
  };

}
