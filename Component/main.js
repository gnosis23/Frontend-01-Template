import "./foo";

function h(Tag, attributes, ...children) {
    let o;

    if (typeof Tag === 'string') {
        o = new Wrapper(Tag);
    } else {
        o = new Tag({
            timer: {}
        });
    }

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    for (let child of children) {
        if (typeof child === 'string') {
            child = new Text(child);
        }
        o.appendChild(child);
    }

    return o;
}

class Text {
    constructor(text) {
        this.root = document.createTextNode(text);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class Wrapper {
    constructor(tag) {
        this.children = [];
        console.log('create', tag);
        this.root = document.createElement(tag);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    mountTo(parent) {
        parent.appendChild(this.root)
        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }
}

class MyComponent {
    constructor(config) {
        this.children = [];
        this.attrs = [];
    }

    setAttribute(name, value) {
        this.attrs.push({ name, value });
    }

    appendChild(child) {
        this.children.push(child);
    }

    render() {
        return <article>
            <header>I'm a header</header>
            {this.slot}
            <footer>I'm a footer</footer>
        </article>
    }

    mountTo(parent) {
        this.slot = <div></div>
        for (let child of this.children) {
            console.log(child, 'mount', this.slot);
            this.slot.appendChild(child);
        }
        this.render().mountTo(parent);
    }
}


let component = (
    <MyComponent class="parent">
        <div className="1">1111</div>
        <p className="2">hello world</p>
        <div className="3">333</div>
    </MyComponent>
)


component.mountTo(document.body);