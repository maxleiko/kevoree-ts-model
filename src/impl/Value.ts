import { observable, action, computed } from 'mobx';

import { Element, JSONObject } from './Element';
import { Named } from './Named';
import { KevoreeFactory } from '../factory/KevoreeFactory';

export class Value<P extends Element> extends Named<P> {
  @observable private _value: string | null = null;

  @computed
  get value(): string | null {
    return this._value;
  }

  set value(value: string | null) {
    this._value = value;
  }

  @action
  withValue(val: string): this {
    this.value = val;
    return this;
  }

  toJSON(key?: any) {
    return {
      ...super.toJSON(key),
      value: this._value,
    };
  }

  fromJSON(data: JSONObject, _factory: KevoreeFactory) {
    super.fromJSON(data, _factory);
    if (data.value !== undefined && data.value !== null) {
      this._value = data.value as string;
    }
  }

  get _className(): string {
    return 'Value';
  }
}
