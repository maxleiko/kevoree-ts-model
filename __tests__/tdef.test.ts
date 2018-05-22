import { Model, Node, Namespace, NodeType, JSONKevoreeLoader, Component, ComponentType } from '../src';

describe('TypeDefinition', () => {
  describe('.delete()', () => {
    it('removes it from the namespace', () => {
      const model = new Model();
      const ns = new Namespace().withName('ns');
      const tdef = new NodeType().withNameAndVersion('Type', 1);
      model.addNamespace(ns);
      ns.addTdef(tdef);
      tdef.delete();
      expect(ns.getTdef(tdef._key)).toBeUndefined();
    });

    it('removes it from all instances', () => {
      const model = new Model();
      const ns = new Namespace().withName('ns');
      const tdef = new NodeType().withNameAndVersion('Type', 1);
      model.addNamespace(ns);
      ns.addTdef(tdef);

      const node0 = new Node().withName('node0').withTdef(tdef);
      const node1 = new Node().withName('node1').withTdef(tdef);
      expect(node0.tdef).toBe(tdef);
      expect(node1.tdef).toBe(tdef);

      tdef.delete();

      expect(node0.tdef).toBeNull();
      expect(node1.tdef).toBeNull();
    });
  });

  describe('.toJSON()/new JSONKevoreeLoader().parse()', () => {
    it('load tdef ref for node properly', () => {
      const model = new Model();
      // add "ns" namespace
      const ns = new Namespace().withName('ns');
      // add "Type:1" to "ns"
      const tdef = new NodeType().withNameAndVersion('Type', 1);
      model.addNamespace(ns);
      ns.addTdef(tdef);
      // create a Node "node" that uses type "Type:1"
      const node = new Node().withTdef(tdef).withName('node');
      model.addNode(node);
  
      const newModel = new JSONKevoreeLoader().parse<Model>(JSON.stringify(model));
  
      expect(newModel.nodes[0].toJSON()).toEqual(node.toJSON());
      expect(newModel.nodes[0].tdef.toJSON()).toEqual(tdef.toJSON());
    });

    it('load tdef ref for components inside nodes', () => {
      const model = new Model();
      // add "ns" namespace
      const ns = new Namespace().withName('ns');
      model.addNamespace(ns);
      // add "NodeType:1" to "ns"
      const nodeType = new NodeType().withNameAndVersion('NodeType', 1);
      ns.addTdef(nodeType);
      const compType = new ComponentType().withNameAndVersion('CompType', 1);
      ns.addTdef(compType);
      // create a Node "node" that uses type "NodeType:1"
      const node = new Node().withTdef(nodeType).withName('node');
      model.addNode(node);
      // create a Component "comp" that uses type "CompType:1"
      const comp = new Component().withTdef(compType).withName('comp');
      node.addComponent(comp);

      const newModel = new JSONKevoreeLoader().parse<Model>(JSON.stringify(model));

      expect(newModel.nodes[0].toJSON()).toEqual(node.toJSON());
      expect(newModel.nodes[0].tdef.toJSON()).toEqual(nodeType.toJSON());
      expect(newModel.nodes[0].components[0].toJSON()).toEqual(comp.toJSON());
      expect(newModel.nodes[0].components[0].tdef.toJSON()).toEqual(compType.toJSON());
    });
  });
});
