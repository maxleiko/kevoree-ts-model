import { observable, computed, action } from 'mobx';

import { Named } from './Named';
import { Component } from './Component';
import { Binding } from './Binding';
import { KevoreeFactory } from '../tools/KevoreeFactory';

export class Port extends Named<Component> {

  @observable private _bindings: Map<string, Binding> = new Map();

  @computed get bindings(): Binding[] {
    return Array.from(this._bindings.values());
  }

  @action addBinding(binding: Binding) {
    if (!binding._key) {
      throw new Error(`Cannot add binding in ${this._key}: binding key is not set`);
    }
    this._bindings.set(binding._key, binding);
  }

  toJSON(key: any): { [s: string]: any } {
    const o = super.toJSON(key);
    o.bindings = this.bindings.map((binding) => binding.path);
    return o;
  }

  fromJSON(data: { [s: string]: any }, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    // TODO refs?
  }

  get _className(): string {
    return 'Port';
  }
}