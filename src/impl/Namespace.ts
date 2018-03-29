import { observable, computed, action } from 'mobx';

import { Named } from './Named';
import { Model } from './Model';
import { TypeDefinition } from './TypeDefinition';
import { DeployUnit } from './DeployUnit';
import { KevoreeFactory } from '../tools/KevoreeFactory';
import { JSONObject } from '.';

export class Namespace extends Named<Model> {
  @observable private _tdefs: Map<string, TypeDefinition> = new Map();
  @observable private _dus: Map<string, DeployUnit> = new Map();

  @computed
  get tdefs(): TypeDefinition[] {
    return Array.from(this._tdefs.values());
  }

  @computed
  get dus(): DeployUnit[] {
    return Array.from(this._dus.values());
  }

  getTdef(key: string) {
    return this._tdefs.get(key);
  }

  @action
  addTdef(tdef: TypeDefinition) {
    if (!tdef._key) {
      throw new Error(`Cannot add type definition in ${this._key}: type definition key is not set`);
    }
    this._tdefs.set(tdef._key, tdef);
    tdef.parent = this;
    tdef.refInParent = 'tdefs';
  }

  @action
  withTdef(tdef: TypeDefinition): this {
    this.addTdef(tdef);
    return this;
  }

  @action
  addDeployUnit(du: DeployUnit) {
    if (!du._key) {
      throw new Error(`Cannot add deploy unit in ${this._key}: deploy unit key is not set`);
    }
    this._dus.set(du._key, du);
    du.parent = this;
    du.refInParent = 'dus';
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);

    if (data.tdefs) {
      const tdefs = data.tdefs as { [s: string]: any };
      Object.keys(tdefs).forEach((key) => {
        const t = (factory as any)[`create${tdefs[key]._className}`]() as TypeDefinition;
        t.parent = this;
        t.refInParent = 'tdefs';
        t.fromJSON(tdefs[key], factory);
        this.addTdef(t);
      });
    }

    if (data.dus) {
      const dus = data.dus as { [s: string]: any };
      Object.keys(dus).forEach((key) => {
        const d = factory.createDeployUnit();
        d.parent = this;
        d.refInParent = 'dus';
        d.fromJSON(dus[key], factory);
        this.addDeployUnit(d);
      });
    }
  }

  get _className(): string {
    return 'Namespace';
  }
}
