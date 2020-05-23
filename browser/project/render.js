/**
 * render
 *
 */
const SvgRender = require('./adaptor/svg');
const Adaptor = SvgRender;

function createViewPort(width, height) {
  return new Adaptor(width, height);
}

function render(viewport, element) {
  if (element.style) {
    viewport.addToCanvas(
      element.style.width,
      element.style.height,
      element.style.left || 0,
      element.style.top || 0,
      element.style['backgroundColor']
    );
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
