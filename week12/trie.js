/**
 * Trie
 *
 */
class Trie {
  constructor() {
    this.root = {
      value: null
    };
  }

  insert(str, value = 1) {
    let node = this.root;
    for (let ch of str) {
      if (!node[ch]) {
        node[ch] = {};
      }
      node = node[ch];
    }
    node.value = value;
  }

  find(str) {
    let node = this.root;
    for (let ch of str) {
      if (node[ch]) {
        node = node[ch];
      } else {
        return false;
      }
    }
    return !!node.value;
  }
}

module.exports = Trie;
