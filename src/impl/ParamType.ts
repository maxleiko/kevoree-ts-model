import { observable, computed } from 'mobx';

import { Named } from './Named';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { TypeDefinition } from './TypeDefinition';
import { JSONObject } from './Element';

export type DataType =
  | 'BYTE'
  | 'SHORT'
  | 'INT'
  | 'LONG'
  | 'FLOAT'
  | 'DOUBLE'
  | 'BOOLEAN'
  | 'CHAR'
  | 'STRING';

export class ParamType<P extends TypeDefinition = TypeDefinition> extends Named<P> {
  @observable private _fragmentDependant: boolean = false;
  @observable private _datatype: DataType = 'STRING';
  @observable private _defaultValue: string | null = null;

  @computed
  get fragmentDependant(): boolean {
    return this._fragmentDependant;
  }

  set fragmentDependant(val: boolean) {
    this._fragmentDependant = val;
  }

  @computed
  get datatype(): DataType {
    return this._datatype;
  }

  set datatype(type: DataType) {
    this._datatype = type;
  }

  @computed
  get defaultValue(): string | null {
    return this._defaultValue;
  }

  set defaultValue(defaultValue: string | null) {
    this._defaultValue = defaultValue;
  }

  toJSON(key?: any) {
    return {
      ...super.toJSON(key),
      fragmentDependant: this._fragmentDependant,
      datatype: this._datatype,
      defaultValue: this._defaultValue,
    };
  }

  fromJSON(data: JSONObject, _factory: KevoreeFactory) {
    super.fromJSON(data, _factory);
    if ('fragmentDependant' in data) {
      this._fragmentDependant = data.fragmentDependant as boolean;
    }
    if ('datatype' in data) {
      this._datatype = data.datatype as DataType;
    }
    if ('defaultValue' in data) {
      this._defaultValue = data.defaultValue as string;
    }
  }

  get _className(): string {
    return 'ParamType';
  }
}
