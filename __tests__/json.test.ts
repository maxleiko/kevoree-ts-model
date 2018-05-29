import {
  JSONKevoreeLoader,
  Model,
  Node,
  Group,
  Component,
  Binding,
  Channel,
  Port,
  NodeType,
  Namespace,
  ParamType,
  Value,
} from '../src';

describe('JSON loader/serializer', () => {
  const loader = new JSONKevoreeLoader();

  it('empty Model', () => {
    const model = new Model();
    expect(JSON.parse(JSON.stringify(model))).toEqual(JSON.parse(JSON.stringify(model)));
  });

  it('Model with nodes', () => {
    const model = new Model();
    model.addNode(new Node().withName('node0'));
    model.addNode(new Node().withName('node1'));
    expect(JSON.parse(JSON.stringify(model))).toEqual(JSON.parse(JSON.stringify(model)));
  });

  it('Model with groups', () => {
    const model = new Model();
    model.addGroup(new Group().withName('group0'));
    model.addGroup(new Group().withName('group1'));
    expect(JSON.parse(JSON.stringify(model))).toEqual(JSON.parse(JSON.stringify(model)));
  });

  it('Model with refs', () => {
    const model = new Model();
    const ns0 = new Namespace().withName('ns0');
    const tdef0 = new NodeType().withNameAndVersion('JavaNode', 1);
    const tdef1 = new NodeType().withNameAndVersion('JavascriptNode', 1);
    const param0 = new ParamType().withName('log');
    param0.datatype = 'STRING';
    param0.defaultValue = 'INFO';
    param0.fragmentDependant = false;
    tdef0.addParamType(param0);
    model.addNamespace(ns0);
    ns0.addTdef(tdef0);
    ns0.addTdef(tdef1);
    model.addNode(new Node().withName('node0').withTdef(tdef0));
    model.addNode(new Node().withName('node1').withTdef(tdef1));
    expect(JSON.parse(JSON.stringify(model))).toEqual(JSON.parse(JSON.stringify(model)));
  });

  it('Model with bindings', () => {
    const model = new Model();
    const node0 = new Node().withName('node0');
    const comp0 = new Component().withName('comp0');
    const port0 = new Port().withName('out');
    const chan0 = new Channel().withName('chan0');
    const bind0 = new Binding().withChannelAndPort(chan0, port0);
    model.addNode(node0);
    node0.addComponent(comp0);
    comp0.addOutput(port0);
    model.addChannel(chan0);
    model.addBinding(bind0);
    expect(JSON.parse(JSON.stringify(model))).toEqual(JSON.parse(JSON.stringify(model)));
  });

  it('Model with metas', () => {
    const model = new Model();
    model.addMeta(new Value<Model>().withName('foo').withValue('bar'));
    expect(JSON.parse(JSON.stringify(model))).toEqual(JSON.parse(JSON.stringify(model)));
  });
});
