import { observable, action, computed } from 'mobx';

import { Element } from './Element';
import { KevoreeFactory } from '../tools/KevoreeFactory';

export abstract class Named<P extends Element<any>> extends Element<P> {

  @observable private _name: string | null = null;

  @computed get _key() {
    return this._name;
  }

  @action withName(name: string): this {
    this._name = name;
    return this;
  }

  get name(): string | null {
    return this._name;
  }

  set name(name: string | null) {
    this._name = name;
  }

  fromJSON(data: { [s: string]: any }, factory: KevoreeFactory) {
    this._name = data.name;
  }

  get _className(): string {
    return 'Named';
  }
}