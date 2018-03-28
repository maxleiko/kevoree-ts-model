import { observable, action } from 'mobx';

import { Element } from './Element';
import { Named } from './Named';

export class Value<P extends Element<any>> extends Named<P> {

  @observable private _value: string | null = null;

  get value(): string | null {
    return this._value;
  }

  set value(value: string | null) {
    this._value = value;
  }

  @action withValue(val: string): this {
    this._value = val;
    return this;
  }

  get _className(): string {
    return 'Value';
  }
}
