import {
  Model,
  Node,
  Namespace,
  NodeType,
  JSONKevoreeLoader,
  Component,
  ComponentType,
  Group,
  Channel,
  Binding,
} from '../src';

describe('Serialization', () => {
  describe('Element.toJSON()', () => {
    describe('default (nothing set)', () => {
      it('Model', () => {
        const model = new Model();
        expect(model.toJSON()).toEqual({
          _className: 'Model',
          nodes: {},
          groups: {},
          bindings: {},
          channels: {},
          namespaces: {},
          metas: {},
        });
      });
  
      it('Node', () => {
        const node = new Node();
        expect(node.toJSON()).toEqual({
          _className: 'Node',
          name: null,
          components: {},
          groups: [],
          metas: {},
          params: {},
          tdef: null,
        });
      });
  
      it('Group', () => {
        const node = new Group();
        expect(node.toJSON()).toEqual({
          _className: 'Group',
          name: null,
          nodes: [],
          metas: {},
          params: {},
          tdef: null,
        });
      });
  
      it('Channel', () => {
        const node = new Channel();
        expect(node.toJSON()).toEqual({
          _className: 'Channel',
          name: null,
          bindings: [],
          metas: {},
          params: {},
          tdef: null,
        });
      });
  
      it('Component', () => {
        const node = new Component();
        expect(node.toJSON()).toEqual({
          _className: 'Component',
          name: null,
          inputs: {},
          outputs: {},
          metas: {},
          params: {},
          tdef: null,
        });
      });
  
      it('Binding', () => {
        const node = new Binding();
        expect(node.toJSON()).toEqual({
          _className: 'Binding',
          channel: null,
          port: null,
          metas: {},
        });
      });
    });
  });
});