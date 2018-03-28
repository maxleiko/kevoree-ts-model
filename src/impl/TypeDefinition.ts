import { observable, computed, action } from 'mobx';

import { Named } from './Named';
import { Namespace } from './Namespace';
import { DeployUnit } from './DeployUnit';
import { ParamType } from '.';

export abstract class TypeDefinition extends Named<Namespace> {

  @observable private _version: number | null = null;
  @observable private _deployUnits: Map<string, DeployUnit> = new Map();
  @observable private _dictionary: Map<string, ParamType<this>> = new Map();

  @computed get deployUnits(): DeployUnit[] {
    return Array.from(this._deployUnits.values());
  }

  @computed get _key() {
    if (this.name && this.version) {
      return `${this.name}:${this._version}`;
    }
    return null;
  }

  @computed get version(): number | null {
    return this._version;
  }

  set version(version: number | null) {
    this._version = version;
  }

  @computed get dictionary(): Array<ParamType<this>> {
    return Array.from(this._dictionary.values());
  }

  @action addParamType(param: ParamType<this>) {
    if (!param._key) {
      throw new Error(`Cannot add param type in ${this._key}: param type key is not set`);
    }
    this._dictionary.set(param._key, param);
    param.parent = this;
    param.refInParent = 'params';
  }

  @action addDeployUnit(du: DeployUnit) {
    this._deployUnits.set(du._key, du);
  }

  @action withVersion(version: number): this {
    this._version = version;
    return this;
  }

  @action withNameAndVersion(name: string, version: number): this {
    this.name = name;
    this._version = version;
    return this;
  }

  get _className(): string {
    return 'TypeDefinition';
  }
}