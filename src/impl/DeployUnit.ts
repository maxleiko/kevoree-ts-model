import { observable, computed, action } from 'mobx';

import { Named } from './Named';
import { Namespace } from './Namespace';

export class DeployUnit extends Named<Namespace> {

  @observable private _hash: string = '';
  @observable private _version: string = '';
  @observable private _platform: string = '';

  @computed get _key(): string {
    return `${this.name}:${this._version}`;
  }

  get hash(): string {
    return this._hash;
  }

  set hash(value: string) {
    this._hash = value;
  }

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  get platform(): string {
    return this._platform;
  }

  set platform(value: string) {
    this._platform = value;
  }

  @action withHash(hash: string): this {
    this._hash = hash;
    return this;
  }

  @action withVersion(version: string): this {
    this._version = version;
    return this;
  }

  @action withPlatform(platform: string): this {
    this._platform = platform;
    return this;
  }

  get _className(): string {
    return 'DeployUnit';
  }
}
