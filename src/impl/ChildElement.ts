import { observable, computed, action } from 'mobx';

import { Element } from './Element';

export abstract class ChildElement<P extends Element> extends Element {

  @observable private _parent: P | null = null;
  @observable private _refInParent: string | null = null;

  @computed
  get path(): string {
    if (!this._key) {
      throw new Error(`Unable to compute path for ${this._className}: _key is null`);
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

  @computed
  get parent(): P | null {
    return this._parent;
  }

  set parent(parent: P | null) {
    this._parent = parent;
  }

  @computed
  get refInParent(): string | null {
    return this._refInParent;
  }

  set refInParent(ref: string | null) {
    this._refInParent = ref;
  }

  getByPath(path: string): Element | null {
    if (path.startsWith('/')) {
      if (this._parent) {
        return this._parent.getByPath(path);
      } else {
        throw new Error(`Path "${path}" cannot be reached from "${this.path}": no parent set.`);
      }
    }
    return super.getByPath(path);
  }

  @action
  delete() {
    super.delete();
    if (this._parent && this._refInParent) {
      const parent: any = this._parent;
      const map: Map<string, this> = parent[`_${this._refInParent}`];
      if (!map) {
        // this is a severe error that implies a bug in this library!
        throw new Error(`Unable to find map "${this._refInParent}" in parent "${parent._key}"`);
      }
      if (!this._key) {
        throw new Error('Cannot delete element from parent: current key is null');
      }
      map.delete(this._key);
    }
  }

  get _className(): string {
    return 'ChildElement';
  }
}