import { observable, computed, action } from 'mobx';

import { Model } from './Model';
import { Instance } from './Instance';
import { Binding } from './Binding';
import { ChannelType } from './ChannelType';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { JSONObject } from '.';

export class Channel extends Instance<ChannelType, Model> {

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

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    if (data.bindings) {
      const bindings = data.bindings as string[];
      bindings.forEach((path) => {
        const binding = this.parent!.getByPath(path) as Binding | null;
        if (binding) {
          this.addBinding(binding);
        }
      });
    }
  }

  get _className(): string {
    return 'Channel';
  }
}