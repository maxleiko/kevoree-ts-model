import { observable, computed, action } from 'mobx';
import { createTransformer } from 'mobx-utils';

import { Value } from './Value';
import { parse } from '../utils';
import { KevoreeFactory } from '../factory';

export interface JSONObject {
  [s: string]: string | number | boolean | object | undefined | null;
}

export abstract class Element<P extends Element<any> | null = null> {
  
  getByPath = createTransformer<string, Element<any> | null>((p) => this._getByPath(p));

  @observable private _refInParent: string | null = null;
  @observable private _parent: P | null = null;
  @observable private _metas: Map<string, Value<this>> = new Map();

  @computed get path(): string {
    if (!this._key) {
      throw new Error(`Cannot compute path for ${this} because "key" is null`);
    }
    if (this._parent && this._parent.path) {
      if (this._parent.path.endsWith('/')) {
        return `${this._parent.path}${this._refInParent}[${this._key}]`;
      } else {
        return `${this._parent.path}/${this._refInParent}[${this._key}]`;
      }
    }
    return this._key;
  }

  @computed get parent(): P | null {
    return this._parent;
  }

  set parent(parent: P | null) {
    this._parent = parent;
  }

  @computed get refInParent(): string | null {
    return this._refInParent;
  }

  set refInParent(ref: string | null) {
    this._refInParent = ref;
  }

  @computed get metas(): Map<string, any> {
    return this._metas;
  }

  @action addMeta(meta: Value<this>) {
    if (!meta._key) {
      throw new Error(`Cannot add meta in ${this._key}: meta key is not set`);
    }
    this._metas.set(meta._key, meta);
    meta._parent = this;
    meta._refInParent = 'metas';
  }

  @action toJSON(_key?: any): { [s: string]: any } {
    const self = this as any;
    const clone: any = { _className: this._className };
    // clone all properties
    for (const prop in self) {
      if (self.hasOwnProperty(prop)) {
        clone[prop.substr(1)] = self[prop];
      }
    }
    // clean model
    delete clone.parent;
    delete clone.refInParent;
    
    return clone;
  }

  abstract fromJSON(data: JSONObject, _factory: KevoreeFactory): void;
  abstract get _key(): string | null;

  get _className(): string {
    return 'Element';
  }

  private _getByPath(path: string): Element<any> | null {
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

  private _getByGraph(graph: Array<{ [s: string]: any }>): Element<any> | null {
    const root = graph.shift();
    if (root) {
      const curr: { [s: string]: any } = this;
      const prop: Map<string, Element<any>> = curr[`_${root.ref}`];
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