import { observable, computed, action } from 'mobx';

import { Named } from './Named';
import { Namespace } from './Namespace';
import { DeployUnit } from './DeployUnit';
import { ParamType, JSONObject } from '.';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { keyUpdater } from '../utils';
import { map2json } from '../utils/map2json';

export abstract class TypeDefinition extends Named<Namespace> {
  @observable private _version: number | null = null;
  @observable private _deployUnits: Map<string, DeployUnit> = new Map();
  @observable private _dictionary: Map<string, ParamType<this>> = new Map();

  @computed
  get deployUnits(): DeployUnit[] {
    return Array.from(this._deployUnits.values());
  }

  @computed
  get _key() {
    if (this.name && this.version) {
      return `${this.name}:${this._version}`;
    }
    return null;
  }

  @computed
  get version(): number | null {
    return this._version;
  }

  set version(version: number | null) {
    if (!version) {
      throw new Error(`TypeDefinition version cannot be null`);
    }
    this._version = version;
  }

  @computed
  get dictionary(): Array<ParamType<this>> {
    return Array.from(this._dictionary.values());
  }

  @action
  addParamType(param: ParamType<this>) {
    if (!param._key) {
      throw new Error(`Cannot add param type in ${this._key}: param type key is not set`);
    }
    this._dictionary.set(param._key, param);
    param.parent = this;
    param.refInParent = 'params';
    keyUpdater(param, this._dictionary);
  }

  @action
  addDeployUnit(du: DeployUnit) {
    this._deployUnits.set(du._key, du);
    keyUpdater(du, this._deployUnits);
  }

  @action
  withVersion(version: number): this {
    this.version = version;
    return this;
  }

  @action
  withNameAndVersion(name: string, version: number): this {
    this.name = name;
    this.version = version;
    return this;
  }

  toJSON(key?: any) {
    return {
      ...super.toJSON(key),
      version: this._version,
      deployUnits: map2json(this._deployUnits),
      dictionary: map2json(this._dictionary),
    };
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    if ('version' in data) {
      this._version = data.version as number;
    }

    if (data.dictionary) {
      const dictionary = data.dictionary as { [s: string]: any };
      Object.keys(dictionary).forEach((key) => {
        const p = factory.createParamType<this>();
        p.parent = this;
        p.refInParent = 'dictionary';
        p.fromJSON(dictionary[key], factory);
        this.addParamType(p);
      });
    }
  }

  get _className(): string {
    return 'TypeDefinition';
  }
}
