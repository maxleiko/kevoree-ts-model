import { observable, computed, action } from 'mobx';

import { Model } from './Model';
import { Instance } from './Instance';
import { Node } from './Node';
import { GroupType } from './GroupType';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { JSONObject } from '.';

export class Group extends Instance<GroupType, Model> {

  @observable private _nodes: Map<string, Node> = new Map();

  @action attachNode(node: Node) {
    if (!node._key) {
      throw new Error(`Cannot attach node in ${this._key}: node key is not set`);
    }
    this._nodes.set(node._key, node);
    // TODO attach group also
  }

  @computed get nodes(): Node[] {
    return Array.from(this._nodes.values());
  }

  toJSON(key: any): { [s: string]: any } {
    const o = super.toJSON(key);
    o.nodes = this.nodes.map((node) => node.path);
    return o;
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    if (data.nodes) {
      const nodes = data.nodes as string[];
      nodes.forEach((path) => {
        const node = this.parent!.getByPath(path) as Node | null;
        if (node) {
          this.attachNode(node);
        }
      });
    }
  }

  get _className(): string {
    return 'Group';
  }
}