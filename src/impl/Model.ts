import { observable, action, computed } from 'mobx';

import { Element, JSONObject } from './Element';
import { Node } from './Node';
import { Namespace } from './Namespace';
import { Group } from './Group';
import { Channel } from './Channel';
import { Binding } from './Binding';
import { KevoreeFactory } from '../tools/KevoreeFactory';

export class Model extends Element {
  @observable private _nodes: Map<string, Node> = new Map();
  @observable private _groups: Map<string, Group> = new Map();
  @observable private _channels: Map<string, Channel> = new Map();
  @observable private _bindings: Map<string, Binding> = new Map();
  @observable private _namespaces: Map<string, Namespace> = new Map();

  @action
  addNode(node: Node) {
    if (!node._key) {
      throw new Error(`Cannot add node in ${this._key}: node key is not set`);
    }
    this._nodes.set(node._key, node);
    node.parent = this;
    node.refInParent = 'nodes';
  }

  @action
  addGroup(group: Group) {
    if (!group._key) {
      throw new Error(`Cannot add group in ${this._key}: group key is not set`);
    }
    this._groups.set(group._key, group);
    group.parent = this;
    group.refInParent = 'groups';
  }

  @action
  addChannel(chan: Channel) {
    if (!chan._key) {
      throw new Error(`Cannot add chan in ${this._key}: chan key is not set`);
    }
    this._channels.set(chan._key, chan);
    chan.parent = this;
    chan.refInParent = 'channels';
  }

  @action
  addBinding(binding: Binding) {
    if (!binding._key) {
      throw new Error(`Cannot add binding in ${this._key}: binding key is not set`);
    }
    this._bindings.set(binding._key, binding);
    binding.parent = this;
    binding.refInParent = 'bindings';
  }

  @action
  addNamespace(ns: Namespace) {
    if (!ns._key) {
      throw new Error(`Cannot add namespace in ${this._key}: namespace key is not set`);
    }
    this._namespaces.set(ns._key, ns);
    ns.parent = this;
    ns.refInParent = 'namespaces';
  }

  @action
  removeNode(node: Node) {
    if (node._key) {
      this._nodes.delete(node._key);
    }
    node.parent = null;
  }

  @action
  removeGroup(group: Group) {
    if (group._key) {
      this._groups.delete(group._key);
    }
    group.parent = null;
  }

  @action
  removeChannel(chan: Channel) {
    if (chan._key) {
      this._channels.delete(chan._key);
    }
    chan.parent = null;
  }

  @action
  removeBinding(binding: Binding) {
    if (binding._key) {
      this._bindings.delete(binding._key);
    }
    binding.parent = null;
  }

  @action
  removeNamespace(ns: Namespace) {
    if (ns._key) {
      this._namespaces.delete(ns._key);
    }
    ns.parent = null;
  }

  @computed
  get nodes(): Node[] {
    return Array.from(this._nodes.values());
  }

  @computed
  get groups(): Group[] {
    return Array.from(this._groups.values());
  }

  @computed
  get channels(): Channel[] {
    return Array.from(this._channels.values());
  }

  @computed
  get bindings(): Binding[] {
    return Array.from(this._bindings.values());
  }

  @computed
  get namespaces(): Namespace[] {
    return Array.from(this._namespaces.values());
  }

  @computed
  get _key(): string {
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

  getBinding(name: string) {
    return this._bindings.get(name);
  }

  getNamespace(name: string) {
    return this._namespaces.get(name);
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    if (data.namespaces) {
      const namespaces = data.namespaces as { [s: string]: any };
      Object.keys(namespaces).forEach((key) => {
        const n = factory.createNamespace();
        n.parent = this;
        n.refInParent = 'namespaces';
        n.fromJSON(namespaces[key], factory);
        this.addNamespace(n);
      });
    }

    if (data.channels) {
      const channels = data.channels as { [s: string]: any };
      Object.keys(channels).forEach((key) => {
        const c = factory.createChannel();
        c.parent = this;
        c.refInParent = 'channels';
        c.fromJSON(channels[key], factory);
        this.addChannel(c);
      });
    }

    if (data.nodes) {
      const nodes = data.nodes as { [s: string]: any };
      Object.keys(nodes).forEach((key) => {
        const n = factory.createNode();
        n.parent = this;
        n.refInParent = 'nodes';
        n.fromJSON(nodes[key], factory);
        this.addNode(n);
      });
    }

    if (data.groups) {
      const groups = data.groups as { [s: string]: any };
      Object.keys(groups).forEach((key) => {
        const g = factory.createGroup();
        g.parent = this;
        g.refInParent = 'groups';
        g.fromJSON(groups[key], factory);
        this.addGroup(g);
      });
    }

    if (data.bindings) {
      const bindings = data.bindings as { [s: string]: any };
      Object.keys(bindings).forEach((key) => {
        const b = factory.createBinding();
        b.parent = this;
        b.refInParent = 'bindings';
        b.fromJSON(bindings[key], factory);
        this.addBinding(b);
      });
    }
  }

  get _className(): string {
    return 'Model';
  }
}
