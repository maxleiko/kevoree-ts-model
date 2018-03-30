import { Node, Group, Channel, Namespace, Component } from '../src';

describe('Node', () => {
  it('create an empty node', () => {
    const node = new Node();
    expect(node.components.length).toEqual(0);
    expect(node.groups.length).toEqual(0);
  });

  describe('add elements to maps', () => {
    it('add component', () => {
      const node = new Node().withName('node0');
      const comp = new Component().withName('comp');
      node.addComponent(comp);
      expect(node.getComponent('comp')).toBe(comp);
    });

    it('add group', () => {
      const node = new Node().withName('node0');
      const group = new Group().withName('sync');
      node.attachGroup(group);
      expect(node.getGroup('sync')).toBe(group);
    });
  });

  describe('remove elements from maps', () => {
    it('remove component', () => {
      const node = new Node().withName('node0');
      const comp = new Component().withName('comp');
      node.addComponent(comp);
      node.removeComponent(comp);
      expect(node.getComponent('comp')).toBeUndefined();
    });

    it('remove group', () => {
      const node = new Node().withName('node0');
      const group = new Group().withName('sync');
      node.attachGroup(group);
      node.detachGroup(group);
      expect(node.getGroup('sync')).toBeUndefined();
    });
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
