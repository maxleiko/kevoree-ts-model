import {
  Node,
  Value,
  ParamType,
  JSONKevoreeLoader,
  Model,
  Component,
  Channel,
  Port,
  Binding,
} from '../src';
import { loadFile, loadJSON } from './utils/load-fixture';

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

  it('of bindings in ports', () => {
    const model = new Model();
    const chan = new Channel().withName('chan');
    model.addChannel(chan);
    const node = new Node().withName('node');
    model.addNode(node);
    const ticker = new Component().withName('ticker');
    node.addComponent(ticker);
    const out = new Port().withName('out');
    ticker.addOutput(out);
    const printer = new Component().withName('printer');
    node.addComponent(printer);
    const input = new Port().withName('in');
    printer.addInput(input);
    const ticker2chan = new Binding().withChannelAndPort(chan, out);
    model.addBinding(ticker2chan);
    const chan2printer = new Binding().withChannelAndPort(chan, input);
    model.addBinding(chan2printer);

    expect(loader.parse(JSON.stringify(model)).toJSON()).toEqual({
      _className: 'Model',
      metas: {},
      nodes: {
        node: {
          _className: 'Node',
          metas: {},
          name: 'node',
          started: false,
          tdef: null,
          params: {},
          groups: [],
          components: {
            printer: {
              _className: 'Component',
              metas: {},
              name: 'printer',
              started: false,
              tdef: null,
              params: {},
              inputs: {
                in: {
                  _className: 'Port',
                  metas: {},
                  name: 'in',
                  bindings: ['/bindings[202065202]'],
                },
              },
              outputs: {},
            },
            ticker: {
              _className: 'Component',
              metas: {},
              name: 'ticker',
              started: false,
              tdef: null,
              params: {},
              inputs: {},
              outputs: {
                out: {
                  _className: 'Port',
                  metas: {},
                  name: 'out',
                  bindings: ['/bindings[90011873]'],
                },
              },
            },
          },
        },
      },
      groups: {},
      bindings: {
        202065202: {
          _className: 'Binding',
          metas: {},
          channel: '/channels[chan]',
          port: '/nodes[node]/components[printer]/inputs[in]',
        },
        90011873: {
          _className: 'Binding',
          metas: {},
          channel: '/channels[chan]',
          port: '/nodes[node]/components[ticker]/outputs[out]',
        },
      },
      channels: {
        chan: {
          _className: 'Channel',
          metas: {},
          name: 'chan',
          started: false,
          tdef: null,
          params: {},
          bindings: [
            '/bindings[90011873]',
            '/bindings[202065202]',
          ],
        },
      },
      namespaces: {},
    });
  });

  it('deserial a json file', () => {
    return Promise.all([
      loadFile('new/local-channel-usecase.json'),
      loadJSON('new/local-channel-usecase.json'),
    ]).then(([str, json]) => {
      expect(loader.parse(str).toJSON()).toEqual(json);
    });
  });
});
