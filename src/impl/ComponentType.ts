import { computed, observable, action } from 'mobx';

import { TypeDefinition } from './TypeDefinition';
import { PortType } from './PortType';

export class ComponentType extends TypeDefinition {

  @observable private _inputs: Map<string, PortType> = new Map();
  @observable private _outputs: Map<string, PortType> = new Map();

  @computed get inputs(): PortType[] {
    return Array.from(this._inputs.values());
  }

  @computed get outputs(): PortType[] {
    return Array.from(this._outputs.values());
  }

  @action addInput(port: PortType) {
    if (!port._key) {
      throw new Error(`Cannot add port type in ${this._key}: port type key is not set`);
    }
    this._inputs.set(port._key, port);
    port.parent = this;
  }

  @action addOutput(port: PortType) {
    if (port._key) {
      this._outputs.set(port._key, port);
    }
    port.parent = this;
  }

  @action withInput(port: PortType): this {
    this.addInput(port);
    return this;
  }

  @action withOutput(port: PortType): this {
    this.addOutput(port);
    return this;
  }

  get _className(): string {
    return 'ComponentType';
  }
}
