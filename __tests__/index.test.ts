/* tslint:disable:no-console */
import {
  Model,
  Node,
  Component,
  NodeType,
  ComponentType,
  PortType,
  Namespace,
} from '../src/impl';

import {
  JSONKevoreeSerializer
} from '../src/tools';

it('creates a model', () => {
  const model = new Model();
  const nodeType = new NodeType()
    .withNameAndVersion('JavascriptNode', 2);
  const compType = new ComponentType()
    .withNameAndVersion('Ticker', 1)
    .withInput(new PortType().withName('out'));

  const node = new Node()
    .withName('node0')
    .withTdef(nodeType);
  const comp = new Component()
    .withName('ticker')
    .withTdef(compType);
  const ns = new Namespace()
    .withName('kevoree')
    .withTdef(nodeType)
    .withTdef(compType);

  node.addComponent(comp);
  model.addNode(node);
  model.addNamespace(ns);

  // const str = new JSONKevoreeSerializer().stringify(model, 2);
  const str = JSON.stringify(model, null, 2);
  console.log(str);
  expect(str).toBeDefined();
});