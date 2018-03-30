import { observable, action, computed } from 'mobx';

import { Element, JSONObject } from './Element';
import { Named } from './Named';
import { KevoreeFactory } from '../factory/KevoreeFactory';

export class Value<P extends Element<any>> extends Named<P> {
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

  fromJSON(data: JSONObject, _factory: KevoreeFactory) {
    super.fromJSON(data, _factory);
    if (data.value) {
      this._value = data.value as string;
    }
  }

  get _className(): string {
    return 'Value';
  }
}
