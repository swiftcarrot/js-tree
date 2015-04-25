var assert = require('assert');
var Tree = require('./index');

describe('tree.js', function() {
  it('populate', function() {
    var tree = new Tree({
      module: 'root',
      children: [{
        module: 'a',
        children: [{
          module: 'c'
        }]
      }, {
        module: 'b'
      }]
    });

    assert.equal(tree.get(1).module, 'root');
    assert.equal(tree.get(2).module, 'a');
    assert.equal(tree.get(3).module, 'c');
    assert.equal(tree.get(4).module, 'b');
  });
});