import { h, Text, Wrapper } from './createElement';

let data = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

class Carousel {
    constructor(config) {
        this.children = [];
        this.attrs = [];
    }

    setAttribute(name, value) {
        this[name] = value;
    }

    render() {
        return (
          <div class="carousel">
              {this.data.map(url => {
                  let element = <img src={url} />;
                  element.addEventListener('dragstart', e => e.preventDefault());
                  return element;
              })}
          </div>
        )
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }
}


let component = (
  <Carousel data={data} />
)


component.mountTo(document.body);
