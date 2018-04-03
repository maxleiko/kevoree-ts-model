import { observable, computed, action } from 'mobx';
import { createTransformer } from 'mobx-utils';

import { Value } from './Value';
import { parse, keyUpdater } from '../utils';
import { KevoreeFactory } from '../factory';

export interface JSONObject {
  [s: string]: string | number | boolean | object | undefined | null;
}

export abstract class Element {
  getByPath = createTransformer<string, Element | null>((p) => this._getByPath(p));
  getMeta = createTransformer<string, Value<this> | undefined>((name) => this._metas.get(name));

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

  @action
  delete() {
    this._deleting = true;
  }

  abstract fromJSON(data: JSONObject, _factory: KevoreeFactory): void;
  abstract get _key(): string | null;

  get _className(): string {
    return 'Element';
  }

  private _getByPath(path: string): Element | null {
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
