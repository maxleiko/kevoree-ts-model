import { Model, Node, Group, Channel, Namespace, Value, Binding, Component, Port } from '../src';
import { hash } from '../src/utils';

describe('Model', () => {
  it('create an empty model', () => {
    const model = new Model();
    expect(model.nodes.length).toEqual(0);
    expect(model.groups.length).toEqual(0);
    expect(model.channels.length).toEqual(0);
    expect(model.namespaces.length).toEqual(0);
  });

  describe('add element in maps', () => {
    it('nodes', () => {
      const model = new Model();
      const node = new Node().withName('node0');
      model.addNode(node);
      expect(model.getNode('node0')).toBe(node);
    });

    it('groups', () => {
      const model = new Model();
      const group = new Group().withName('sync');
      model.addGroup(group);
      expect(model.getGroup('sync')).toBe(group);
    });

    it('channels', () => {
      const model = new Model();
      const channel = new Channel().withName('channel');
      model.addChannel(channel);
      expect(model.getChannel('channel')).toBe(channel);
    });

    it('namespaces', () => {
      const model = new Model();
      const ns = new Namespace().withName('kevoree');
      model.addNamespace(ns);
      expect(model.getNamespace('kevoree')).toBe(ns);
    });

    it('metas', () => {
      const model = new Model();
      const meta = new Value<Model>().withName('description').withValue('My desc');
      model.addMeta(meta);
      expect(model.getMeta('description')).toBe(meta);
    });
  });

  describe('remove elements from maps', () => {
    it('remove a node', () => {
      const model = new Model();
      const node = new Node().withName('node0');
      model.addNode(node);
      model.removeNode(node);
      expect(model.getNode('node0')).toBeUndefined();
    });

    it('remove a node after renaming', () => {
      const model = new Model();
      const node = new Node().withName('node0');
      model.addNode(node);
      node.name = 'newName';
      model.removeNode(node);
      expect(model.getNode('node0')).toBeUndefined();
      expect(model.getNode('newName')).toBeUndefined();
    });
  });

  describe('map keys get automatically updated on children key changes', () => {
    describe('for nodes', () => {
      describe('using ref', () => {
        const model = new Model();
        const node = new Node().withName('node0');
        model.addNode(node);
        node.name = 'newName';
        expect(model.getNode('newName')).toBe(node);
        expect(model.getNode('node0')).toBeUndefined();
      });

      describe('using getter', () => {
        const model = new Model();
        model.addNode(new Node().withName('node0'));
        const node = model.getNode('node0');
        node.name = 'newName';
        expect(model.getNode('newName')).toBe(node);
        expect(model.getNode('node0')).toBeUndefined();
      });
    });

    it('for groups', () => {
      const model = new Model();
      const group = new Group().withName('group0');
      model.addGroup(group);
      group.name = 'newName';
      expect(model.getGroup('newName')).toBe(group);
      expect(model.getGroup('group0')).toBeUndefined();
    });

    it('for channels', () => {
      const model = new Model();
      const chan = new Channel().withName('chan0');
      model.addChannel(chan);
      chan.name = 'newName';
      expect(model.getChannel('newName')).toBe(chan);
      expect(model.getChannel('chan0')).toBeUndefined();
    });

    it('for namespaces', () => {
      const model = new Model();
      const ns = new Namespace().withName('ns0');
      model.addNamespace(ns);
      ns.name = 'newName';
      expect(model.getNamespace('newName')).toBe(ns);
      expect(model.getNamespace('ns0')).toBeUndefined();
    });

    it('for bindings', () => {
      const model = new Model();
      const chan = new Channel().withName('chan');
      const node = new Node().withName('node');
      const comp = new Component().withName('comp');
      const port = new Port().withName('port');
      node.addComponent(comp);
      comp.addInput(port);
      const binding = new Binding().withChannelAndPort(chan, port);
      model.addBinding(binding);
      expect(model.getBinding(hash(`${chan._key}_${port._key}`))).toBe(binding);

      const chan2 = new Channel().withName('otherChan');
      binding.channel = chan2;
      expect(model.getBinding(hash(`${chan2._key}_${port._key}`))).toBe(binding);
      expect(model.getBinding(hash(`${chan._key}_${port._key}`))).toBeUndefined();
    });
  });

  describe('elem.delete() should update map', () => {
    it('for nodes', () => {
      const model = new Model();
      const node = new Node().withName('node0');
      model.addNode(node);
      expect(model.getNode('node0')).toBe(node);
      node.delete();
      expect(model.getNode('node0')).toBeUndefined();
    });
  });
});
