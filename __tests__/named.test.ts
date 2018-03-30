import { Node } from '../src';

describe('Named', () => {
  it('prevent key from being null', () => {
    const node = new Node();
    expect(() => {
      node.name = null;
    }).toThrow(`Name key cannot be null`);
  });
});
