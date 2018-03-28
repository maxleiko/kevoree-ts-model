import { Model, Node, Group, Channel, Namespace } from '../src';

describe('Model', () =>  {
  it('should create an empty model', () => {
    const model = new Model();
    expect(model.nodes.length).toEqual(0);
    expect(model.groups.length).toEqual(0);
    expect(model.channels.length).toEqual(0);
    expect(model.namespaces.length).toEqual(0);
  });

  it('should get added node', () => {
    const model = new Model();
    const node = new Node().withName('node0');
    model.addNode(node);
    expect(model.getNode('node0')).toBe(node);
  });

  it('should get added group', () => {
    const model = new Model();
    const group = new Group().withName('sync');
    model.addGroup(group);
    expect(model.getGroup('sync')).toBe(group);
  });

  it('should get added channel', () => {
    const model = new Model();
    const channel = new Channel().withName('channel');
    model.addChannel(channel);
    expect(model.getChannel('channel')).toBe(channel);
  });

  it('should get added namespace', () => {
    const model = new Model();
    const ns = new Namespace().withName('kevoree');
    model.addNamespace(ns);
    expect(model.getNamespace('kevoree')).toBe(ns);
  });
});