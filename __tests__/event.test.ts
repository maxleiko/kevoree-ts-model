import { autorun } from 'mobx';

import { Model, Node } from '../src';

describe('Event', () => {
  it('add node', () => {
    const model = new Model();
    return new Promise((resolve) => {
      const dispose = autorun(() => {
        const node = model.getNode('node0');
        if (node) {
          expect(node).toHaveProperty('name', 'node0');
          dispose();
          resolve();
        }
      });

      model.addNode(new Node().withName('node0'));
    });
  });

  it('path gets automatically updated in parent map', () => {
    const model = new Model();
    const node = new Node().withName('node0');
    model.addNode(node);
    // update node's name
    node.name = 'newName';
    expect(model.getNode('newName')).toBe(node);
    expect(model.getNode('node0')).toBeUndefined();
  });
});
