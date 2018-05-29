import { Node, Value, ParamType, JSONKevoreeLoader, Model, Component } from '../src';

describe('Deserialization', () => {
  const loader = new JSONKevoreeLoader();

  it('of params in Node', () => {
    const node = new Node().withName('node');
    node.addParam(new Value<Node>().withName('logFilter').withValue('INFO'));

    expect(loader.parse(JSON.stringify(node)).toJSON()).toEqual({
      _className: 'Node',
      name: 'node',
      started: false,
      components: {},
      groups: [],
      params: {
        logFilter: {
          _className: 'Value',
          name: 'logFilter',
          value: 'INFO',
          metas: {},
        },
      },
      tdef: null,
      metas: {},
    });
  });
});
