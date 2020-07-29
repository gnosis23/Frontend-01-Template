var parser = require('./parser');

module.exports = function(source, map) {
    const tree = parser.parseHTML(source);
    console.log(tree.children[2].children[0].content);


    let template = null;
    let script = null;

    for (let node of tree.children) {
        if (node.tagName === 'template')
            template = node.children.filter(e => e.type !== 'text')[0];
        if (node.tagName === 'script')
            script = node;
    }

    let createCode;

    console.log(template);

    let visit = (node, depth) => {
        if (node.type === 'text') return JSON.stringify(node.content);
        let attrs = {};
        for (let attribute of (node.attributes || [])) {
            attrs[attribute.name] = attribute.value;
        }
        let children = node.children
          .map(child => visit(child, depth + 1)) || 'null';
        return `h("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`;
    };

    createCode = visit(template, 0)

    let r = `
import { h, Text, Wrapper } from './createElement';    
export class Carousel {
    render() {
        return ${createCode}
    }
    setAttribute(name, value) {}
    mountTo(parent) {
        this.render().mountTo(parent);
    }
}    
    `;

    console.log(r);

    return r;
}
