function Tree(obj) {
  this.obj = obj;
  this.indexes = {};
  this.build();
}

var proto = Tree.prototype;

proto.build = function() {
  var obj = this.obj;
  var indexes = this.indexes;
  var startId = 1;

  var index = {id: startId, node: obj};
  indexes[startId+''] = index;
  startId++;

  walk(obj.children, index);

  function walk(objs, parent) {
    var children = [];
    objs.forEach(function(obj, i) {
      var index = {};
      index.id = startId;
      index.node = obj;

      if(parent) index.parent = parent.id;

      indexes[startId+''] = index;
      children.push(startId);
      startId++;

      if(obj.children && obj.children.length) walk(obj.children, index);
    });
    parent.children = children;

    children.forEach(function(id, i) {
      var index = indexes[id+''];
      if(i > 0) index.prev = children[i-1];
      if(i < children.length-1) index.next = children[i+1];
    });
  }
};

proto.walk = function(fn) {
  var json = fn(this.json);
  walk(json.children, fn, json);

  function walk(children, fn, parent) {
    children.forEach(function(node) {
      var node = fn(node, parent);
      if(node.children && node.children.length) {
        walk(node.children, fn, node);
      }
    });
  }
};

proto.get = function(id) {
  return this.nodes[id+''];
};

proto.remove = function(id) {
  var node = this.get(id);
  var parent = this.get(node.parentId);
  parent.children.splice(parent.children.indexOf(node), 1);
  return node;
};

proto.insertBefore = function(node, destId) {
  var dest = this.get(destId);
  var toId = dest.parentId;
  var index = this.get(toId).children.indexOf(dest);
  this.insert(node, toId, index);
};

proto.insertAfter = function(node, destId) {
  var dest = this.get(destId);
  var toId = dest.parentId;
  var index = this.get(toId).children.indexOf(dest);
  this.insert(node, toId, index+1);
};

proto.prepend = function(node, destId) {
  this.insert(node, destId, 0);
};

proto.append = function(node, destId) {
  var dest = this.get(destId);
  this.insert(node, destId, dest.children.length);
};

proto.insert = function(node, toId, index) {
  var parent = this.get(toId);
  var children = parent.children;
  node.parentId = toId;
  children.splice(index, 0, node);

  if(index > 0) node.prev = children[index-1].id;
  else node.prev = null;

  if(index < children.length-1) node.next = children[index+1].id;
  else node.next = null;
};

proto.move = function(fromId, toId, placement) {
  var from = this.get(fromId);
  var to = this.get(toId);

  if(fromId !== toId && toId !== 1) {
    var node = this.remove(fromId);

    if(placement === 'before') {
      this.insertBefore(node, toId);
    }

    if(placement === 'after') {
      this.insertAfter(node, toId);
    }

    if(placement === 'prepend') {
      this.prepend(node, toId);
    }

    if(placement === 'append') {
      this.append(node, toId);
    }
  }
};

proto.toJSON = function() {
  return this.obj;
};

module.exports = Tree;