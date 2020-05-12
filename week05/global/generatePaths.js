/**
 * javascript global objects
 */

let start = [
  // constructors
  Number,
  Object,
  String,
  Symbol,
  Boolean,
  Array,
  Date,
  Promise,
  Proxy,
  RegExp,
  WeakMap,
  WeakSet,
  Set,
  Map,
  Function,
  // namespace
  JSON,
  Math,
  Atomics,
  Reflect,
  // functions
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  eval,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  // typed array
  ArrayBuffer,
  DataView,
  SharedArrayBuffer,
  Float32Array,
  Float64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint8ClampedArray,
  Uint16Array,
  Uint32Array,
  // errors
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
];

function join(path, sub) {
  return path ? `${path}.${sub}` : sub;
}

function getName(node) {
  if (typeof node === 'function') return node.name;
  if (typeof node === 'object') {
    if (node === Reflect) return 'Reflect';
    return node[Symbol.toStringTag]
  }
  throw new Error(node);
}

function generatePaths() {
  let paths = [];
  let id = 0;
  const set = new Set(start);

  /**
   *
   * @param node
   * @param path
   * @param parent_id
   */
  function traverse(node, path, parent_id = 0) {
    // if (typeof node === 'object') console.warn(path, node);
    paths.push({
      id: ++id,
      path: path,
      parent_id: parent_id
    });
    const next_parent_id = id;

    for (let propName of Object.getOwnPropertyNames(node)) {
      const descriptor = Object.getOwnPropertyDescriptor(node, propName);

      if (
        (descriptor.value !== null && typeof descriptor.value === 'object') ||
        (typeof descriptor.value === 'function')
      ) {
        if (!set.has(descriptor.value)) {
          set.add(descriptor.value);
          traverse(node[propName], join(path, propName), next_parent_id)
        }
      }

      if (descriptor.get && !set.has(descriptor.get)) {
        set.add(descriptor.get);
        traverse(descriptor.get, join(path, propName), next_parent_id)
      }

      if (descriptor.set && !set.has(descriptor.set)) {
        set.add(descriptor.set);
        traverse(descriptor.set, join(path, propName), next_parent_id)
      }
    }
  }

  start.forEach(node => traverse(node, getName(node)));
  return paths;
}

export default generatePaths;
