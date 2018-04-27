import { Node, Binding, Channel, Component, Port, Model } from '../src';

describe('Binding', () => {
  it('withChanAndPort should add binding to chan/port', () => {
    const chan = new Channel().withName('chan');
    const node = new Node().withName('node');
    const comp = new Component().withName('comp');
    const port = new Port().withName('port');
    const binding = new Binding().withChannelAndPort(chan, port);

    expect(binding.port).toBe(port);
    expect(binding.channel).toBe(chan);
    expect(port.bindings[0]).toBe(binding);
    expect(chan.bindings[0]).toBe(binding);
  });

  it('delete should remove binding from chan/port', () => {
    const chan = new Channel().withName('chan');
    const node = new Node().withName('node');
    const comp = new Component().withName('comp');
    const port = new Port().withName('port');
    const binding = new Binding().withChannelAndPort(chan, port);

    expect(port.bindings[0]).toBe(binding);
    expect(chan.bindings[0]).toBe(binding);

    binding.delete();

    expect(binding.port).toBeNull();
    expect(binding.channel).toBeNull();
    expect(port.bindings.length).toEqual(0);
    expect(chan.bindings.length).toEqual(0);
  });

  it('delete should remove binding from model', () => {
    const model = new Model();
    const chan = new Channel().withName('chan');
    const node = new Node().withName('node');
    const comp = new Component().withName('comp');
    const port = new Port().withName('port');
    const binding = new Binding().withChannelAndPort(chan, port);
    model.addBinding(binding);

    expect(model.bindings[0]).toBe(binding);
    expect(port.bindings[0]).toBe(binding);
    expect(chan.bindings[0]).toBe(binding);

    binding.delete();

    expect(binding.port).toBeNull();
    expect(binding.channel).toBeNull();
    expect(model.bindings.length).toEqual(0);
    expect(port.bindings.length).toEqual(0);
    expect(chan.bindings.length).toEqual(0);
  });
});
