import { observable, action, computed } from 'mobx';

import { Named } from './Named';
import { Element } from './Element';
import { TypeDefinition } from './TypeDefinition';
import { Value } from './Value';
import { KevoreeFactory } from '../tools/KevoreeFactory';

export abstract class Instance<
  T extends TypeDefinition = TypeDefinition,
  P extends Element<any> = Element<any>
> extends Named<P> {

  @observable private _started: boolean = false;
  @observable private _tdef: T | null = null;
  @observable private _params: Map<string, Value<this>> = new Map();

  @computed get tdef(): T | null {
    return this._tdef;
  }

  set tdef(tdef: T | null) {
    this._tdef = tdef;
  }

  @computed get started() {
    return this._started;
  }

  set started(started: boolean) {
    this._started = started;
  }

  @computed get params(): Array<Value<this>> {
    return Array.from(this._params.values());
  }

  @action addParam(param: Value<this>) {
    if (!param._key) {
      throw new Error(`Cannot add param in ${this._key}: param key is not set`);
    }
    this._params.set(param._key, param);
    param.parent = this;
    param.refInParent = 'dictionary';
  }

  getParam(name: string) {
    return this._params.get(name);
  }

  @action withTdef(tdef: T | null): this {
    this._tdef = tdef;
    return this;
  }

  toJSON(key: any): { [s: string]: any } {
    const o = super.toJSON(key);
    if (this._tdef) {
      o.tdef = this._tdef.path;
    }
    return o;
  }

  fromJSON(data: { [s: string]: any }, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    this._started = data.started;
    // TODO refs?
  }

  get _className(): string {
    return 'Instance';
  }
}