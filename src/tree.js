class Tree {
  constructor(obj, childNodeName = 'children') {
    this.cnt = 1;
    this.obj = obj || { [childNodeName]: [] };
    this.indexes = {};
    this.childNodeName = childNodeName;
    this.build(this.obj);
  }

  build(obj) {
    const indexes = this.indexes;
    const startId = this.cnt;
    const self = this;

    const index = { id: startId, node: obj };
    indexes[this.cnt + ''] = index;
    this.cnt++;

    if (obj[self.childNodeName] && obj[self.childNodeName].length) {
      walk(obj[self.childNodeName], index);
    }

    function walk(objs, parent) {
      const children = [];
      objs.forEach(function(obj, i) {
        const index = {};
        index.id = self.cnt;
        index.node = obj;

        if (parent) index.parent = parent.id;

        indexes[self.cnt + ''] = index;
        children.push(self.cnt);
        self.cnt++;

        if (obj[self.childNodeName] && obj[self.childNodeName].length)
          walk(obj[self.childNodeName], index);
      });
      parent[self.childNodeName] = children;

      children.forEach(function(id, i) {
        const index = indexes[id + ''];
        if (i > 0) index.prev = children[i - 1];
        if (i < children.length - 1) index.next = children[i + 1];
      });
    }

    return index;
  }

  getIndex(id) {
    const index = this.indexes[id + ''];
    if (index) return index;
  }

  removeIndex(index) {
    const self = this;
    del(index);

    function del(index) {
      delete self.indexes[index.id + ''];
      if (index[self.childNodeName] && index[self.childNodeName].length) {
        index[self.childNodeName].forEach(function(child) {
          del(self.getIndex(child));
        });
      }
    }
  }

  get(id) {
    const index = this.getIndex(id);
    if (index && index.node) return index.node;
    return null;
  }

  remove(id) {
    const index = this.getIndex(id);
    const node = this.get(id);
    const parentIndex = this.getIndex(index.parent);
    const parentNode = this.get(index.parent);

    parentNode[this.childNodeName].splice(
      parentNode[this.childNodeName].indexOf(node),
      1
    );
    parentIndex[this.childNodeName].splice(
      parentIndex[this.childNodeName].indexOf(id),
      1
    );
    this.removeIndex(index);
    this.updateChildren(parentIndex[this.childNodeName]);

    return node;
  }

  updateChildren(children) {
    children.forEach(
      function(id, i) {
        const index = this.getIndex(id);
        index.prev = index.next = null;
        if (i > 0) index.prev = children[i - 1];
        if (i < children.length - 1) index.next = children[i + 1];
      }.bind(this)
    );
  }

  insert(obj, parentId, i) {
    const parentIndex = this.getIndex(parentId);
    const parentNode = this.get(parentId);

    const index = this.build(obj);
    index.parent = parentId;

    parentNode[this.childNodeName] = parentNode[this.childNodeName] || [];
    parentIndex[this.childNodeName] = parentIndex[this.childNodeName] || [];

    parentNode[this.childNodeName].splice(i, 0, obj);
    parentIndex[this.childNodeName].splice(i, 0, index.id);

    this.updateChildren(parentIndex[this.childNodeName]);
    if (parentIndex.parent) {
      this.updateChildren(
        this.getIndex(parentIndex.parent)[this.childNodeName]
      );
    }

    return index;
  }

  insertBefore(obj, destId) {
    const destIndex = this.getIndex(destId);
    const parentId = destIndex.parent;
    const i = this.getIndex(parentId)[this.childNodeName].indexOf(destId);
    return this.insert(obj, parentId, i);
  }

  insertAfter(obj, destId) {
    const destIndex = this.getIndex(destId);
    const parentId = destIndex.parent;
    const i = this.getIndex(parentId)[this.childNodeName].indexOf(destId);
    return this.insert(obj, parentId, i + 1);
  }

  prepend(obj, destId) {
    return this.insert(obj, destId, 0);
  }

  append(obj, destId) {
    const destIndex = this.getIndex(destId);
    destIndex[this.childNodeName] = destIndex[this.childNodeName] || [];
    return this.insert(obj, destId, destIndex[this.childNodeName].length);
  }
}

module.exports = Tree;
