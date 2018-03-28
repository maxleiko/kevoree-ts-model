import { observable, computed, action } from 'mobx';

import { Node } from './Node';
import { Instance } from './Instance';
import { Port } from './Port';
import { ComponentType } from './ComponentType';
import { KevoreeFactory } from '../tools/KevoreeFactory';

export class Component extends Instance<ComponentType, Node> {

  @observable private _inputs: Map<string, Port> = new Map();
  @observable private _outputs: Map<string, Port> = new Map();

  @computed get inputs(): Port[] {
    return Array.from(this._inputs.values());
  }

  @computed get outputs(): Port[] {
    return Array.from(this._outputs.values());
  }

  @action addInput(port: Port) {
    if (!port._key) {
      throw new Error(`Cannot add port in ${this._key}: port key is not set`);
    }
    this._inputs.set(port._key, port);
    port.parent = this;
    port.refInParent = 'inputs';
  }

  @action addOutput(port: Port) {
    if (port._key) {
      this._outputs.set(port._key, port);
    }
    port.parent = this;
    port.refInParent = 'outputs';
  }

  fromJSON(data: { [s: string]: any }, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    Object.keys(data.inputs).forEach((key) => {
      const port = factory.createPort();
      port.fromJSON(data.inputs[key], factory);
      this.addInput(port);
    });
    Object.keys(data.outputs).forEach((key) => {
      const port = factory.createPort();
      port.fromJSON(data.outputs[key], factory);
      this.addOutput(port);
    });
  }

  get _className(): string {
    return 'Component';
  }
}