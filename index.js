function Tree(obj, childNodeName) {
  this.cnt = 1;
  this.obj = obj || {children:[]};
  this.indexes = {};
  this.childNodeName = childNodeName || "children";
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

  if(obj[self.childNodeName] && obj[self.childNodeName].length) walk(obj[self.childNodeName], index);

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

      if(obj[self.childNodeName] && obj[self.childNodeName].length) walk(obj[self.childNodeName], index);
    });
    parent[self.childNodeName] = children;

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
    if(index[self.childNodeName] && index[self.childNodeName].length) {
      index[self.childNodeName].forEach(function(child) {
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
  var self = this;
  parentNode[self.childNodeName].splice(parentNode[self.childNodeName].indexOf(node), 1);
  parentIndex[self.childNodeName].splice(parentIndex[self.childNodeName].indexOf(id), 1);
  this.removeIndex(index);
  this.updateChildren(parentIndex[self.childNodeName]);

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
  var self = this;

  var index = this.build(obj);
  index.parent = parentId;

  parentNode[self.childNodeName] = parentNode[self.childNodeName] || [];
  parentIndex[self.childNodeName] = parentIndex[self.childNodeName] || [];

  parentNode[self.childNodeName].splice(i, 0, obj);
  parentIndex[self.childNodeName].splice(i, 0, index.id);

  this.updateChildren(parentIndex[self.childNodeName]);
  if(parentIndex.parent) {
    this.updateChildren(this.getIndex(parentIndex.parent)[self.childNodeName]);
  }

  return index;
};

proto.insertBefore = function(obj, destId) {
  var destIndex = this.getIndex(destId);
  var parentId = destIndex.parent;
  var self = this;
  var i = this.getIndex(parentId)[self.childNodeName].indexOf(destId);
  return this.insert(obj, parentId, i);
};

proto.insertAfter = function(obj, destId) {
  var destIndex = this.getIndex(destId);
  var parentId = destIndex.parent;
  var self = this;
  var i = this.getIndex(parentId)[self.childNodeName].indexOf(destId);
  return this.insert(obj, parentId, i+1);
};

proto.prepend = function(obj, destId) {
  return this.insert(obj, destId, 0);
};

proto.append = function(obj, destId) {
  var destIndex = this.getIndex(destId);
  var self = this;
  destIndex[self.childNodeName] = destIndex[self.childNodeName] || [];
  return this.insert(obj, destId, destIndex[self.childNodeName].length);
};

module.exports = Tree;