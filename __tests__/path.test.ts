import { parse, SyntaxError } from '../src/utils/path-parser';

describe('Path', () =>  {
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
    const g = parse('/namespaces[kevoree]/deployUnits[kevoree-node-javascript:5.0.0-alpha:hashjfhyfyr937465]');
    expect(g.length).toBe(2);
    expect(g[0]).toEqual({ ref: 'namespaces', key: 'kevoree' });
    expect(g[1]).toEqual({ ref: 'deployUnits', key: 'kevoree-node-javascript:5.0.0-alpha:hashjfhyfyr937465' });
  });

  it('should throw when path is malformed', () => {
    try {
      const g = parse('thatwontwork');
    } catch (err) {
      expect(err.message).toBe('Expected "/" but "t" found.');
    }
  });
});