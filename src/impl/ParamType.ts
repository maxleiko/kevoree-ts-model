import { observable, computed } from 'mobx';

import { Named } from './Named';
import { Element } from './Element';

export type DataType = 'BYTE' | 'SHORT' | 'INT' | 'LONG' | 'FLOAT' | 'DOUBLE' | 'BOOLEAN' | 'CHAR' | 'STRING';

export class ParamType<P extends Element<any> = Element<any>> extends Named<P> {

  @observable private _fragmentDependant: boolean = false;
  @observable private _datatype: DataType = 'STRING';
  @observable private _defaultValue: string | null = null;

  @computed get fragmentDependant(): boolean {
    return this._fragmentDependant;
  }

  set fragmentDependant(val: boolean) {
    this._fragmentDependant = val;
  }

  @computed get datatype(): DataType {
    return this._datatype;
  }

  set datatype(type: DataType) {
    this._datatype = type;
  }

  @computed get defaultValue(): string | null {
    return this._defaultValue;
  }

  fromJSON(data: { [s: string]: any }) {
    this._fragmentDependant = data.fragmentDependant;
    this._datatype = data.datatype;
    this._defaultValue = data.defaultValue;
  }

  get _className(): string {
    return 'ParamType';
  }
}
