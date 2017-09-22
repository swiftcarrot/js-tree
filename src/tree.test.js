import Tree from './tree';

function createTree() {
  return new Tree({
    module: 'root',
    children: [
      {
        module: 'a',
        children: [{ module: 'c' }]
      },
      {
        module: 'b'
      }
    ]
  });
}

describe('Tree', function() {
  it('empty tree', function() {
    const tree = new Tree();
    expect(tree.obj).toEqual({ children: [] });
  });

  it('custom childNodeName', function() {
    let tree = new Tree(null, 'properties');
    expect(tree.obj).toEqual({ properties: [] });

    tree = new Tree(
      {
        propName: 'root',
        properties: [
          {
            propName: 'a',
            properties: [{ propName: 'c' }]
          },
          {
            propName: 'b'
          }
        ]
      },
      'properties'
    );

    const obj = tree.obj;
    const indexes = tree.indexes;

    expect(indexes['1']).toEqual({
      id: 1,
      node: obj,
      properties: [2, 4]
    });

    expect(indexes['2']).toEqual({
      id: 2,
      parent: 1,
      properties: [3],
      node: obj.properties[0],
      next: 4
    });

    expect(indexes['3']).toEqual({
      id: 3,
      parent: 2,
      node: obj.properties[0].properties[0]
    });

    expect(indexes['4']).toEqual({
      id: 4,
      parent: 1,
      node: obj.properties[1],
      prev: 2
    });
  });

  it('#build', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    expect(indexes['1']).toEqual({
      id: 1,
      node: obj,
      children: [2, 4]
    });

    expect(indexes['2']).toEqual({
      id: 2,
      parent: 1,
      children: [3],
      node: obj.children[0],
      next: 4
    });

    expect(indexes['3']).toEqual({
      id: 3,
      parent: 2,
      node: obj.children[0].children[0]
    });

    expect(indexes['4']).toEqual({
      id: 4,
      parent: 1,
      node: obj.children[1],
      prev: 2
    });
  });

  it('#get', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    expect(tree.get(1)).toEqual(obj);
    expect(tree.get(10)).toBeNull();
  });

  it('#remove', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    const node = tree.remove(2);

    expect(node).toEqual({ module: 'a', children: [{ module: 'c' }] });
    expect(obj).toEqual({
      module: 'root',
      children: [{ module: 'b' }]
    });
    expect(tree.getIndex(2)).toBeUndefined();
    expect(tree.getIndex(3)).toBeUndefined();
  });

  it('#insert', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    tree.insert({ module: 'd' }, 3, 0);

    expect(obj).toEqual({
      module: 'root',
      children: [
        {
          module: 'a',
          children: [
            {
              module: 'c',
              children: [{ module: 'd' }]
            }
          ]
        },
        { module: 'b' }
      ]
    });
  });

  it('#insertBefore', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    tree.insertBefore({ module: 'd' }, 3);

    expect(obj).toEqual({
      module: 'root',
      children: [
        {
          module: 'a',
          children: [{ module: 'd' }, { module: 'c' }]
        },
        { module: 'b' }
      ]
    });
  });

  it('#insertAfter', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    tree.insertAfter({ module: 'd' }, 3);

    expect(obj).toEqual({
      module: 'root',
      children: [
        {
          module: 'a',
          children: [{ module: 'c' }, { module: 'd' }]
        },
        { module: 'b' }
      ]
    });
  });

  it('#prepend', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    tree.prepend({ module: 'd' }, 1);

    expect(obj).toEqual({
      module: 'root',
      children: [
        {
          module: 'd'
        },
        {
          module: 'a',
          children: [{ module: 'c' }]
        },
        {
          module: 'b'
        }
      ]
    });
  });

  it('#append', function() {
    const tree = createTree();
    const obj = tree.obj;
    const indexes = tree.indexes;

    tree.append({ module: 'd' }, 1);

    expect(obj).toEqual({
      module: 'root',
      children: [
        {
          module: 'a',
          children: [{ module: 'c' }]
        },
        {
          module: 'b'
        },
        {
          module: 'd'
        }
      ]
    });
  });
});
