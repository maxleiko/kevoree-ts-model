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
  Value,
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

      it('Model with metas', () => {
        const model = new Model();
        model.addMeta(new Value<Model>().withName('foo').withValue('bar'));
        expect(model.toJSON()).toEqual({
          _className: 'Model',
          nodes: {},
          groups: {},
          bindings: {},
          channels: {},
          namespaces: {},
          metas: {
            foo: {
              _className: 'Value',
              name: 'foo',
              value: 'bar',
              metas: {}
            }
          },
        });
      });
  
      it('Node', () => {
        const node = new Node();
        expect(node.toJSON()).toEqual({
          _className: 'Node',
          name: null,
          started: false,
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
          started: false,
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
          started: false,
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
          started: false,
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