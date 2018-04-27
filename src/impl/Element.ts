import { observable, computed, action } from 'mobx';

import { Value } from './Value';
import { parse, keyUpdater } from '../utils';
import { KevoreeFactory } from '../factory';

export interface JSONObject {
  [s: string]: string | number | boolean | object | undefined | null;
}

export abstract class Element {
  @observable private _deleting: boolean = false;
  @observable private _metas: Map<string, Value<this>> = new Map();

  @computed
  get path(): string {
    if (!this._key) {
      throw new Error(`Cannot compute path for ${this._className} because "key" is null`);
    }
    return this._key;
  }

  @computed
  get deleting(): boolean {
    return this._deleting;
  }

  set deleting(deleting: boolean) {
    this._deleting = deleting;
  }

  @computed
  get metas(): Array<Value<this>> {
    return Array.from(this._metas.values());
  }

  @action
  addMeta(meta: Value<this>) {
    if (!meta._key) {
      throw new Error(`Cannot add meta in ${this._key}: meta key is not set`);
    }
    this._metas.set(meta._key, meta);
    meta.parent = this;
    meta.refInParent = 'metas';
    keyUpdater(meta, this._metas);
  }

  @action
  delete() {
    this._deleting = true;
  }

  getByPath(path: string): Element | null {
    if (path === '/') {
      return this;
    }
    let graph: any[] | null;
    try {
      graph = parse(path);
    } catch (err) {
      throw new Error(`Unable to parse given path "${path}" (${err.message})`);
    }
    if (graph) {
      return this._getByGraph(graph);
    }
    return null;
  }

  getMeta(name: string): Value<this> | undefined {
    return this._metas.get(name);
  }

  toJSON(_key?: any): { [s: string]: any } {
    const self = this as any;
    const clone: any = { _className: this._className };
    // clone all properties
    for (const prop in self) {
      if (self.hasOwnProperty(prop)) {
        if (typeof self[prop] !== 'function') {
          clone[prop.substr(1)] = self[prop];
        }
      }
    }
    // clean model
    delete clone.parent;
    delete clone.refInParent;
    delete clone.deleting;

    return clone;
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    if (data.metas) {
      const metas = data.metas as { [s: string]: any };
      Object.keys(metas).forEach((key) => {
        const v = factory.createValue<this>();
        v.parent = this;
        v.refInParent = 'metas';
        v.fromJSON(metas[key], factory);
        this.addMeta(v);
      });
    }
  }

  abstract get _key(): string | null;

  get _className(): string {
    return 'Element';
  }

  private _getByGraph(graph: Array<{ [s: string]: any }>): Element | null {
    const root = graph.shift();
    if (root) {
      const curr: { [s: string]: any } = this;
      const prop: Map<string, Element> = curr[`_${root.ref}`];
      if (prop) {
        const ref = prop.get(root.key);
        if (ref) {
          if (graph.length > 0) {
            return ref._getByGraph(graph);
          }
          return ref;
        }
      }
    }
    return null;
  }
}
