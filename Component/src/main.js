import { h, Text, Wrapper } from './createElement';
import Carousel from './Carousel';
import TabPanel from './TabPanel';
import ListView from './ListView';

let data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

let panel = <TabPanel title="this is my panel">
  <span title="titlea">abc 1</span>
  <span title="titleb">abc 2</span>
  <span title="titlec">abc 3</span>
  <span title="titled">abc 4</span>
</TabPanel>

panel.mountTo(document.body);

let component = (
  <Carousel data={data} />
)

component.mountTo(document.body);

let data2 = [
  {url: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg", title:'image1'},
  {url: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg", title:'image2'},
  {url: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg", title:'image3'},
  {url: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg", title:'image4'},
];


let list = (
  <ListView data={data2}>
    {item => (
      <figure>
        <img src={item.url} alt="" style="width:300px;" />
        <figcaption>{item.title}</figcaption>
      </figure>
    )}
  </ListView>
)

list.mountTo(document.body);
