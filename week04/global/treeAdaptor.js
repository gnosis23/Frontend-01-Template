/**
 * tree adaptor
 *
 * [{ id, path, parent_id }] => { id, children: [{id, children}] }
 *
 */

function buildTree(source = [], depthLimit = 3) {
  const tree = { id: 'Global Objects', children: [], _id: 0 };

  function build(root, depth = 0) {
    const children = source.filter(x => x.parent_id === root._id);
    if (depth >= depthLimit) return;

    if (children.length > 0) {
      root.children = children.map(child => ({
        id: child.path,
        children: [],
        _id: child.id
      }));
      root.children.forEach(child => build(child, depth + 1))
    }
  }

  build(tree);
  return tree;
}

export default buildTree;
