var assert = require('assert');
var Tree = require('./index');

describe('tree.js', function() {
  it('builds indexes correctly', function() {
    var obj = {
      module: 'root',
      children: [{
        module: 'a',
        children: [{
          module: 'c'
        }]
      }, {
        module: 'b'
      }]
    };
    var tree = new Tree(obj);
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
});