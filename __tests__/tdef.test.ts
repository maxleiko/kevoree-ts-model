import { Model, Node, Namespace, NodeType } from '../src';

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
});
