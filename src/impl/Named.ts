import { observable, action, computed } from 'mobx';

import { Element, JSONObject } from './Element';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { ChildElement } from './ChildElement';

export abstract class Named<P extends Element> extends ChildElement<P> {
  @observable private _name: string | null = null;

  @computed
  get _key() {
    return this._name;
  }

  @action
  withName(name: string): this {
    this.name = name;
    return this;
  }

  @computed
  get name(): string | null {
    return this._name;
  }

  set name(name: string | null) {
    if (!name) {
      throw new Error('Name key cannot be null');
    }
    this._name = name;
  }

  toJSON(key?: any) {
    return {
      ...super.toJSON(key),
      name: this._name,
    };
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    if (data.name) {
      this._name = data.name as string;
    }
  }

  get _className(): string {
    return 'Named';
  }
}
