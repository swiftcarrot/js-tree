var _empty = {module: 'root', children: []};

function Tree(root) {
  root = root || _empty;
  this.root = root.module ? root : _empty;
  this.nodes = {};
  this.populate();
}

var proto = Tree.prototype;

proto.populate = function() {
  var startId = 1;
  var nodes = this.nodes;
  var root = this.root;

  // root
  nodes[startId+''] = root;
  root.id = startId++;
  root.collapsed = false;
  root.data = root.data || {};

  walk(root.children, root);

  function walk(children, parent) {
    children.forEach(function(node, i) {
      node.id = startId;
      node.data = node.data || {};
      node.children = node.children || [];

      if(parent) node.parentId = parent.id;

      nodes[startId+''] = node;
      startId++;

      if(node.children && node.children.length) {
        walk(node.children, node);
      }

      if(i > 0) node.prev = children[i-1].id;
      if(i < children.length-1) node.next = children[i+1].id;
    });
  }
};

proto.walk = function(fn) {
  var root = fn(this.root);
  walk(root.children, fn, root);

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

module.exports = Tree;