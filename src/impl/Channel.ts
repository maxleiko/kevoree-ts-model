import { observable, computed, action } from 'mobx';

import { Model } from './Model';
import { Instance } from './Instance';
import { Binding } from './Binding';
import { ChannelType } from './ChannelType';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { JSONObject } from '.';
import { keyUpdater } from '../utils/key-updater';

export class Channel extends Instance<ChannelType, Model> {
  @observable private _bindings: Map<string, Binding> = new Map();

  @computed
  get bindings(): Binding[] {
    return Array.from(this._bindings.values());
  }

  @action
  addBinding(binding: Binding) {
    if (!binding._key) {
      throw new Error(`Cannot add binding in ${this._key}: binding key is not set`);
    }
    this._bindings.set(binding._key, binding);
    keyUpdater(binding, this._bindings);
  }

  @action
  removeBinding(key: string) {
    this._bindings.delete(key);
  }

  toJSON(key?: any) {
    return {
      ...super.toJSON(key),
      bindings: this.bindings.map((b) => b.path),
    };
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    if (data.bindings) {
      const bindings = data.bindings as string[];
      bindings.forEach((path) => {
        const binding = this.getByPath(path) as Binding | null;
        if (binding) {
          this.addBinding(binding);
        } else {
          // tslint:disable-next-line
          console.log('UNABLE TO FIND BINDING', path);
        }
      });
    }
  }

  get _className(): string {
    return 'Channel';
  }
}
