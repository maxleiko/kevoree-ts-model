import { computed, observable, action } from 'mobx';

import { TypeDefinition } from './TypeDefinition';
import { PortType } from './PortType';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { JSONObject } from '.';
import { keyUpdater } from '../utils';
import { map2json } from '../utils/map2json';

export class ComponentType extends TypeDefinition {
  @observable private _inputs: Map<string, PortType> = new Map();
  @observable private _outputs: Map<string, PortType> = new Map();

  @computed
  get inputs(): PortType[] {
    return Array.from(this._inputs.values());
  }

  @computed
  get outputs(): PortType[] {
    return Array.from(this._outputs.values());
  }

  @action
  addInput(port: PortType) {
    if (!port._key) {
      throw new Error(`Cannot add port type in ${this._key}: port type key is not set`);
    }
    this._inputs.set(port._key, port);
    port.parent = this;
    keyUpdater(port, this._inputs);
  }

  @action
  addOutput(port: PortType) {
    if (port._key) {
      this._outputs.set(port._key, port);
    }
    port.parent = this;
    keyUpdater(port, this._outputs);
  }

  @action
  withInput(port: PortType): this {
    this.addInput(port);
    return this;
  }

  @action
  withOutput(port: PortType): this {
    this.addOutput(port);
    return this;
  }

  toJSON(key?: any) {
    return {
      ...super.toJSON(key),
      inputs: map2json(this._inputs),
      outputs: map2json(this._outputs),
    };
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);

    if (data.inputs) {
      const inputs = data.inputs as { [s: string]: any };
      Object.keys(inputs).forEach((key) => {
        const p = factory.createPortType();
        p.parent = this;
        p.refInParent = 'inputs';
        p.fromJSON(inputs[key], factory);
        this.addInput(p);
      });
    }

    if (data.outputs) {
      const outputs = data.outputs as { [s: string]: any };
      Object.keys(outputs).forEach((key) => {
        const p = factory.createPortType();
        p.parent = this;
        p.refInParent = 'outputs';
        p.fromJSON(outputs[key], factory);
        this.addOutput(p);
      });
    }
  }

  get _className(): string {
    return 'ComponentType';
  }
}
