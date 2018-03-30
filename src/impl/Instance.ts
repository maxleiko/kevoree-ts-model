import { observable, action, computed } from 'mobx';

import { Named } from './Named';
import { Element, JSONObject } from './Element';
import { TypeDefinition } from './TypeDefinition';
import { Value } from './Value';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { createTransformer } from 'mobx-utils';
import { keyUpdater } from '../utils';

export abstract class Instance<
  T extends TypeDefinition = TypeDefinition,
  P extends Element<any> = Element<any>
> extends Named<P> {
  getParam = createTransformer<string, Value<this> | undefined>((name) => this._params.get(name));

  @observable private _started: boolean = false;
  @observable private _tdef: T | null = null;
  @observable private _params: Map<string, Value<this>> = new Map();

  @computed
  get tdef(): T | null {
    return this._tdef;
  }

  set tdef(tdef: T | null) {
    this._tdef = tdef;
  }

  @computed
  get started() {
    return this._started;
  }

  set started(started: boolean) {
    this._started = started;
  }

  @computed
  get params(): Array<Value<this>> {
    return Array.from(this._params.values());
  }

  @action
  addParam(param: Value<this>) {
    if (!param._key) {
      throw new Error(`Cannot add param in ${this._key}: param key is not set`);
    }
    this._params.set(param._key, param);
    param.parent = this;
    param.refInParent = 'dictionary';
    keyUpdater(param, this._params);
  }

  @action
  withTdef(tdef: T | null): this {
    this._tdef = tdef;
    return this;
  }

  toJSON(_key?: any): { [s: string]: any } {
    const o = super.toJSON(_key);
    if (this._tdef) {
      o.tdef = this._tdef.path;
    }
    return o;
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    if ('started' in data) {
      this._started = data.started as boolean;
    }
    if (data.tdef) {
      const tdef = this.parent!.getByPath(data.tdef as string) as T | null;
      if (tdef) {
        this._tdef = tdef;
      }
    }
    if (data.params) {
      const params = data.params as { [s: string]: any };
      Object.keys(params).forEach((key) => {
        const p = (factory as any)[`create${params[key]._className}`]();
        p.parent = this;
        p.fromJSON(data, factory);
        this.addParam(p);
      });
    }
  }

  get _className(): string {
    return 'Instance';
  }
}
