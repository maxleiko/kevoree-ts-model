import { Model, Node, Component } from '../src';
import { parse, SyntaxError } from '../src/utils/path-parser';

describe('Path', () => {
  it('should parse "/"', () => {
    const g = parse('/');
    expect(g.length).toBe(0);
  });

  it('should parse single level path "/nodes[node0]"', () => {
    const g = parse('/nodes[node0]');
    expect(g.length).toBe(1);
    expect(g[0]).toEqual({ ref: 'nodes', key: 'node0' });
  });

  it('should parse nested path', () => {
    const g = parse(
      '/namespaces[kevoree]/deployUnits[kevoree-node-javascript:5.0.0-alpha:hashjfhyfyr937465]',
    );
    expect(g.length).toBe(2);
    expect(g[0]).toEqual({ ref: 'namespaces', key: 'kevoree' });
    expect(g[1]).toEqual({
      ref: 'deployUnits',
      key: 'kevoree-node-javascript:5.0.0-alpha:hashjfhyfyr937465',
    });
  });

  it('should throw when path is malformed', () => {
    try {
      const g = parse('thatwontwork');
    } catch (err) {
      expect(err.message).toBe('Expected "/" but "t" found.');
    }
  });

  it('should return / for root', () => {
    const model = new Model();
    expect(model.path).toEqual('/');
  });

  it('should nest path following this pattern: ${parent._key}/${_refInParent}[${_key}]', () => {
    const model = new Model();
    const node = new Node().withName('node0');
    model.addNode(node);
    expect(node.path).toEqual('/nodes[node0]');
  });

  it('should work for more than 1 level of nest', () => {
    const model = new Model();
    const node = new Node().withName('node0');
    const comp = new Component().withName('comp0');
    model.addNode(node);
    node.addComponent(comp);
    expect(comp.path).toEqual('/nodes[node0]/components[comp0]');
  });
});
