import { observable, computed, action } from 'mobx';

import { Named } from './Named';
import { Namespace } from './Namespace';
import { JSONObject } from '.';
import { KevoreeFactory } from '../factory';

export class DeployUnit extends Named<Namespace> {
  @observable private _hash: string = '';
  @observable private _version: string = '';

  @computed
  get _key(): string {
    return `${this.name}:${this._version}`;
  }

  @computed
  get hash(): string {
    return this._hash;
  }

  set hash(value: string) {
    this._hash = value;
  }

  @computed
  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  @action
  withHash(hash: string): this {
    this.hash = hash;
    return this;
  }

  @action
  withVersion(version: string): this {
    this.version = version;
    return this;
  }

  fromJSON(data: JSONObject, _factory: KevoreeFactory) {
    super.fromJSON(data, _factory);
    if (data.hash) {
      this._hash = data.hash as string;
    }
    if (data.version) {
      this._version = data.version as string;
    }
  }

  get _className(): string {
    return 'DeployUnit';
  }
}
