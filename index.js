function Tree(obj) {
  this.cnt = 1;
  this.obj = obj || {children:[]};
  this.indexes = {};
  this.build(this.obj);
}

var proto = Tree.prototype;

proto.build = function(obj) {
  var indexes = this.indexes;
  var startId = this.cnt;
  var self = this;

  var index = {id: startId, node: obj};
  indexes[this.cnt+''] = index;
  this.cnt++;

  if(obj.children && obj.children.length) walk(obj.children, index);

  function walk(objs, parent) {
    var children = [];
    objs.forEach(function(obj, i) {
      var index = {};
      index.id = self.cnt;
      index.node = obj;

      if(parent) index.parent = parent.id;

      indexes[self.cnt+''] = index;
      children.push(self.cnt);
      self.cnt++;

      if(obj.children && obj.children.length) walk(obj.children, index);
    });
    parent.children = children;

    children.forEach(function(id, i) {
      var index = indexes[id+''];
      if(i > 0) index.prev = children[i-1];
      if(i < children.length-1) index.next = children[i+1];
    });
  }

  return index;
};

proto.getIndex = function(id) {
  var index = this.indexes[id+''];
  if(index) return index;
};

proto.removeIndex = function(index) {
  var self = this;
  del(index);

  function del(index) {
    delete self.indexes[index.id+''];
    if(index.children && index.children.length) {
      index.children.forEach(function(child) {
        del(self.getIndex(child));
      });
    }
  }
};

proto.get = function(id) {
  var index = this.getIndex(id);
  if(index && index.node) return index.node;
  return null;
};

proto.remove = function(id) {
  var index = this.getIndex(id);
  var node = this.get(id);
  var parentIndex = this.getIndex(index.parent);
  var parentNode = this.get(index.parent);
  parentNode.children.splice(parentNode.children.indexOf(node), 1);
  parentIndex.children.splice(parentIndex.children.indexOf(id), 1);
  this.removeIndex(index);
  this.updateChildren(parentIndex.children);

  return node;
};

proto.updateChildren = function(children) {
  children.forEach(function(id, i) {
    var index = this.getIndex(id);
    index.prev = index.next = null;
    if(i > 0) index.prev = children[i-1];
    if(i < children.length-1) index.next = children[i+1];
  }.bind(this));
};

proto.insert = function(obj, parentId, i) {
  var parentIndex = this.getIndex(parentId);
  var parentNode = this.get(parentId);

  var index = this.build(obj);
  index.parent = parentId;

  parentNode.children = parentNode.children || [];
  parentIndex.children = parentIndex.children || [];

  parentNode.children.splice(i, 0, obj);
  parentIndex.children.splice(i, 0, index.id);

  this.updateChildren(parentIndex.children);
  if(parentIndex.parent) {
    this.updateChildren(this.getIndex(parentIndex.parent).children);
  }

  return index;
};

proto.insertBefore = function(obj, destId) {
  var destIndex = this.getIndex(destId);
  var parentId = destIndex.parent;
  var i = this.getIndex(parentId).children.indexOf(destId);
  return this.insert(obj, parentId, i);
};

proto.insertAfter = function(obj, destId) {
  var destIndex = this.getIndex(destId);
  var parentId = destIndex.parent;
  var i = this.getIndex(parentId).children.indexOf(destId);
  return this.insert(obj, parentId, i+1);
};

proto.prepend = function(obj, destId) {
  return this.insert(obj, destId, 0);
};

proto.append = function(obj, destId) {
  var destIndex = this.getIndex(destId);
  destIndex.children = destIndex.children || [];
  return this.insert(obj, destId, destIndex.children.length);
};

module.exports = Tree;
