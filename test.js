var assert = require('assert');
var Tree = require('./index');

function _tree() {
  return new Tree({
    module: 'root',
    children: [{
      module: 'a',
      children: [{module: 'c'}]
    }, {
      module: 'b'
    }]
  });
}

describe('tree.js', function() {
  it('empty json', function() {
    var tree = new Tree();
    assert.deepEqual(tree.obj, {children:[]});
  });

  it('build()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    assert.deepEqual(indexes['1'], {
      id: 1,
      node: obj,
      children: [2, 4]
    });

    assert.deepEqual(indexes['2'], {
      id: 2,
      parent: 1,
      children: [3],
      node: obj.children[0],
      next: 4,
    });

    assert.deepEqual(indexes['3'], {
      id: 3,
      parent: 2,
      node: obj.children[0].children[0]
    });

    assert.deepEqual(indexes['4'], {
      id: 4,
      parent: 1,
      node: obj.children[1],
      prev: 2
    });
  });

  it('get()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    assert.deepEqual(tree.get(1), obj);
    assert.deepEqual(tree.get(10), null);
  });

  it('remove()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    var node = tree.remove(2);
    assert.deepEqual(node, {module: 'a', children: [{module: 'c'}]});
    assert.deepEqual(obj, {
      module: 'root',
      children: [{module: 'b'}]
    });
    assert.strictEqual(tree.getIndex(2), undefined);
    assert.strictEqual(tree.getIndex(3), undefined);
  });

  it('insert()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.insert({module: 'd'}, 3, 0);
    assert.deepEqual(obj, {
      module: 'root',
      children: [{
        module: 'a',
        children: [{
          module: 'c',
          children: [{module: 'd'}]
        }]
      }, {module: 'b'}]
    });
  });

  it('insertBefore()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.insertBefore({module: 'd'}, 3);

    assert.deepEqual(obj, {
      module: 'root',
      children: [{
        module: 'a',
        children: [
          {module: 'd'},
          {module: 'c'}
        ]
      }, {module: 'b'}]
    });
  });

  it('insertAfter()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.insertAfter({module: 'd'}, 3);
    assert.deepEqual(obj, {
      module: 'root',
      children: [{
        module: 'a',
        children: [
          {module: 'c'},
          {module: 'd'}
        ]
      }, {module: 'b'}]
    });
  });

  it('prepend()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.prepend({module: 'd'}, 1);
    assert.deepEqual(obj, {
      module: 'root',
      children: [{
        module: 'd'
      }, {
        module: 'a',
        children: [{module: 'c'}]
      }, {
        module: 'b'
      }]
    });
  });

  it('append()', function() {
    var tree = _tree();
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.append({module: 'd'}, 1);
    assert.deepEqual(obj, {
      module: 'root',
      children: [{
        module: 'a',
        children: [{module: 'c'}]
      }, {
        module: 'b'
      }, {
        module: 'd'
      }]
    });
  });
});

// Custom properties tests
function _treeCustom(childNodeName) {
  return new Tree({
    propName: 'root',
    properties: [{
      propName: 'a',
      properties: [{propName: 'c'}]
    }, {
      propName: 'b'
    }]
  }, childNodeName);
}

describe('tree-custom.js', function() {
  it('empty json', function() {
    var tree = new Tree();
    assert.deepEqual(tree.obj, {children:[]});
  });

  it('build()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    assert.deepEqual(indexes['1'], {
      id: 1,
      node: obj,
      properties: [2, 4]
    });

    assert.deepEqual(indexes['2'], {
      id: 2,
      parent: 1,
      properties: [3],
      node: obj.properties[0],
      next: 4,
    });

    assert.deepEqual(indexes['3'], {
      id: 3,
      parent: 2,
      node: obj.properties[0].properties[0]
    });

    assert.deepEqual(indexes['4'], {
      id: 4,
      parent: 1,
      node: obj.properties[1],
      prev: 2
    });
  });

  it('get()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    assert.deepEqual(tree.get(1), obj);
    assert.deepEqual(tree.get(10), null);
  });

  it('remove()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    var node = tree.remove(2);
    assert.deepEqual(node, {propName: 'a', properties: [{propName: 'c'}]});
    assert.deepEqual(obj, {
      propName: 'root',
      properties: [{propName: 'b'}]
    });
    assert.strictEqual(tree.getIndex(2), undefined);
    assert.strictEqual(tree.getIndex(3), undefined);
  });

  it('insert()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.insert({propName: 'd'}, 3, 0);
    assert.deepEqual(obj, {
      propName: 'root',
      properties: [{
        propName: 'a',
        properties: [{
          propName: 'c',
          properties: [{propName: 'd'}]
        }]
      }, {propName: 'b'}]
    });
  });

  it('insertBefore()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.insertBefore({propName: 'd'}, 3);

    assert.deepEqual(obj, {
      propName: 'root',
      properties: [{
        propName: 'a',
        properties: [
          {propName: 'd'},
          {propName: 'c'}
        ]
      }, {propName: 'b'}]
    });
  });

  it('insertAfter()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.insertAfter({propName: 'd'}, 3);
    assert.deepEqual(obj, {
      propName: 'root',
      properties: [{
        propName: 'a',
        properties: [
          {propName: 'c'},
          {propName: 'd'}
        ]
      }, {propName: 'b'}]
    });
  });

  it('prepend()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.prepend({propName: 'd'}, 1);
    assert.deepEqual(obj, {
      propName: 'root',
      properties: [{
        propName: 'd'
      }, {
        propName: 'a',
        properties: [{propName: 'c'}]
      }, {
        propName: 'b'
      }]
    });
  });

  it('append()', function() {
    var tree = _treeCustom('properties');
    var obj = tree.obj;
    var indexes = tree.indexes;

    tree.append({propName: 'd'}, 1);
    assert.deepEqual(obj, {
      propName: 'root',
      properties: [{
        propName: 'a',
        properties: [{propName: 'c'}]
      }, {
        propName: 'b'
      }, {
        propName: 'd'
      }]
    });
  });
});