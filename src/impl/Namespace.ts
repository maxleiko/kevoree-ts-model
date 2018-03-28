import { observable, computed, action } from 'mobx';

import { Named } from './Named';
import { Model } from './Model';
import { TypeDefinition } from './TypeDefinition';
import { DeployUnit } from './DeployUnit';
import { KevoreeFactory } from '../tools/KevoreeFactory';

export class Namespace extends Named<Model> {
  
  @observable private _tdefs: Map<string, TypeDefinition> = new Map();
  @observable private _dus: Map<string, DeployUnit> = new Map();

  @computed get tdefs(): TypeDefinition[] {
    return Array.from(this._tdefs.values());
  }

  @computed get dus(): DeployUnit[] {
    return Array.from(this._dus.values());
  }

  getTdef(key: string) {
    return this._tdefs.get(key);
  }

  @action addTdef(tdef: TypeDefinition) {
    if (!tdef._key) {
      throw new Error(`Cannot add type definition in ${this._key}: type definition key is not set`);
    }
    this._tdefs.set(tdef._key, tdef);
    tdef.parent = this;
    tdef.refInParent = 'tdefs';
  }

  @action withTdef(tdef: TypeDefinition): this {
    this.addTdef(tdef);
    return this;
  }

  @action addDeployUnit(du: DeployUnit) {
    if (!du._key) {
      throw new Error(`Cannot add deploy unit in ${this._key}: deploy unit key is not set`);
    }
    this._dus.set(du._key, du);
    du.parent = this;
    du.refInParent = 'dus';
  }

  fromJSON(data: { [s: string]: any }, factory: KevoreeFactory) {
    super.fromJSON(data, factory);

    Object.keys(data.tdefs).forEach((key) => {
      const t = (factory as any)[`create${data.tdefs[key]._className}`]();
      t.fromJSON(data.tdefs[key], factory);
      this.addTdef(t);
    });

    Object.keys(data.dus).forEach((key) => {
      const d = factory.createDeployUnit();
      d.fromJSON(data.dus[key], factory);
      this.addDeployUnit(d);
    });
  }

  get _className(): string {
    return 'Namespace';
  }
}