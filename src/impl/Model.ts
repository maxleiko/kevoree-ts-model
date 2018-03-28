import { observable, action, computed } from 'mobx';

import { Element } from './Element';
import { Node } from './Node';
import { Namespace } from './Namespace';
import { Group } from './Group';
import { Channel } from './Channel';
import { KevoreeFactory } from '../tools/KevoreeFactory';

export class Model extends Element {

  @observable private _nodes: Map<string, Node> = new Map();
  @observable private _groups: Map<string, Group> = new Map();
  @observable private _channels: Map<string, Channel> = new Map();
  @observable private _namespaces: Map<string, Namespace> = new Map();

  @action addNode(node: Node) {
    if (!node._key) {
      throw new Error(`Cannot add node in ${this._key}: node key is not set`);
    }
    this._nodes.set(node._key, node);
    node.parent = this;
    node.refInParent = 'nodes';
  }

  @action addGroup(group: Group) {
    if (!group._key) {
      throw new Error(`Cannot add group in ${this._key}: group key is not set`);
    }
    this._groups.set(group._key, group);
    group.parent = this;
    group.refInParent = 'groups';
  }

  @action addChannel(chan: Channel) {
    if (!chan._key) {
      throw new Error(`Cannot add chan in ${this._key}: chan key is not set`);
    }
    this._channels.set(chan._key, chan);
    chan.parent = this;
    chan.refInParent = 'channels';
  }

  @action addNamespace(ns: Namespace) {
    if (!ns._key) {
      throw new Error(`Cannot add namespace in ${this._key}: namespace key is not set`);
    }
    this._namespaces.set(ns._key, ns);
    ns.parent = this;
    ns.refInParent = 'namespaces';
  }

  @action removeNode(node: Node) {
    if (node._key) {
      this._nodes.delete(node._key); 
    }
    node.parent = null;
  }

  @action removeGroup(group: Group) {
    if (group._key) {
      this._groups.delete(group._key); 
    }
    group.parent = null;
  }

  @action removeChannel(chan: Channel) {
    if (chan._key) {
      this._channels.delete(chan._key); 
    }
    chan.parent = null;
  }

  @action removeNamespace(ns: Namespace) {
    if (ns._key) {
      this._namespaces.delete(ns._key); 
    }
    ns.parent = null;
  }

  @computed get nodes(): Node[] {
    return Array.from(this._nodes.values());
  }

  @computed get groups(): Group[] {
    return Array.from(this._groups.values());
  }

  @computed get channels(): Channel[] {
    return Array.from(this._channels.values());
  }

  @computed get namespaces(): Namespace[] {
    return Array.from(this._namespaces.values());
  }

  @computed get _key(): string {
    return '/';
  }

  getNode(name: string) {
    return this._nodes.get(name);
  }

  getGroup(name: string) {
    return this._groups.get(name);
  }

  getChannel(name: string) {
    return this._channels.get(name);
  }

  getNamespace(name: string) {
    return this._namespaces.get(name);
  }

  fromJSON(data: { [s: string]: any }, factory: KevoreeFactory) {
    Object.keys(data.namespaces).forEach((key) => {
      const n = factory.createNamespace();
      n.parent = this;
      n.refInParent = 'namespaces';
      n.fromJSON(data.namespaces[key], factory);
      this.addNamespace(n);
    });

    Object.keys(data.nodes).forEach((key) => {
      const n = factory.createNode();
      n.parent = this;
      n.refInParent = 'nodes';
      n.fromJSON(data.nodes[key], factory);
      this.addNode(n);
    });

    Object.keys(data.groups).forEach((key) => {
      const g = factory.createGroup();
      g.parent = this;
      g.refInParent = 'groups';
      g.fromJSON(data.groups[key], factory);
      this.addGroup(g);
    });

    Object.keys(data.channels).forEach((key) => {
      const c = factory.createChannel();
      c.parent = this;
      c.refInParent = 'channels';
      c.fromJSON(data.channels[key], factory);
      this.addChannel(c);
    });
  }

  get _className(): string {
    return 'Model';
  }
}