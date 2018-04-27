import { Node, Group, Channel, Namespace, Component } from '../src';

describe('Node', () => {
  it('create an empty node', () => {
    const node = new Node();
    expect(node.components.length).toEqual(0);
    expect(node.groups.length).toEqual(0);
  });

  describe('components', () => {
    it('add', () => {
      const node = new Node().withName('node0');
      const comp = new Component().withName('comp');

      node.addComponent(comp);

      expect(node.getComponent('comp')).toBe(comp);
      expect(comp.parent).toBe(node);

      node.removeComponent(comp);

      expect(node.getComponent('comp')).toBeUndefined();
      expect(comp.parent).toBeNull();
    });
  });

  describe('groups', () => {
    const node = new Node().withName('node');
    const group = new Group().withName('group');

    node.attachGroup(group);

    expect(node.getGroup('group')).toBe(group);
    expect(group.getNode('node')).toBe(node);

    node.detachGroup(group);

    expect(node.getGroup('group')).toBeUndefined();
    expect(group.getNode('node')).toBeUndefined();
  });

  describe('map keys get automatically updated on children key changes', () => {
    it('for components', () => {
      const node = new Node().withName('node0');
      const comp = new Component().withName('comp');
      node.addComponent(comp);
      comp.name = 'newName';
      expect(node.getComponent('newName')).toBe(comp);
      expect(node.getComponent('comp')).toBeUndefined();
    });

    it('for groups', () => {
      const node = new Node().withName('node0');
      const group = new Group().withName('group');
      node.attachGroup(group);
      group.name = 'newName';
      expect(node.getGroup('newName')).toBe(group);
      expect(node.getGroup('group')).toBeUndefined();
    });
  });
});
