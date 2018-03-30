import { observable, action, computed } from 'mobx';

import { Model } from './Model';
import { Component } from './Component';
import { Instance } from './Instance';
import { NodeType } from './NodeType';
import { Group } from './Group';
import { KevoreeFactory } from '../factory/KevoreeFactory';
import { JSONObject } from '.';
import { createTransformer } from 'mobx-utils';
import { keyUpdater } from '../utils';

export class Node extends Instance<NodeType, Model> {
  getComponent = createTransformer<string, Component | undefined>((name) => this._components.get(name));
  getGroup = createTransformer<string, Group | undefined>((name) => this._groups.get(name));

  @observable private _components: Map<string, Component> = new Map();
  @observable private _groups: Map<string, Group> = new Map();

  @action
  addComponent(comp: Component) {
    if (!comp._key) {
      throw new Error(`Cannot add component in ${this._key}: component key is not set`);
    }
    this._components.set(comp._key, comp);
    comp.parent = this;
    comp.refInParent = 'components';
    keyUpdater(comp, this._components);
  }

  @action
  removeComponent(comp: Component) {
    if (comp._key) {
      this._components.delete(comp._key);
    }
    comp.parent = null;
  }

  @computed
  get components(): Component[] {
    return Array.from(this._components.values());
  }

  @computed
  get groups(): Group[] {
    return Array.from(this._groups.values());
  }

  @action
  attachGroup(group: Group) {
    if (!group._key) {
      throw new Error(`Cannot attach group in ${this._key}: group key is not set`);
    }
    this._groups.set(group._key, group);
    keyUpdater(group, this._groups);
  }

  @action
  detachGroup(group: Group) {
    if (group._key) {
      this._groups.delete(group._key);
      // TODO detach group also
    }
  }

  toJSON() {
    const o = super.toJSON();
    o.groups = this.groups.map((g) => g.path);
    return o;
  }

  fromJSON(data: JSONObject, factory: KevoreeFactory) {
    super.fromJSON(data, factory);
    if (data.tdef) {
      const tdef = this.parent!.getByPath(data.tdef as string);
      if (tdef && tdef instanceof NodeType) {
        this.tdef = tdef;
      }
    }

    if (data.components) {
      const components = data.components as { [s: string]: any };
      Object.keys(components).forEach((key) => {
        const comp = factory.createComponent();
        comp.parent = this;
        comp.refInParent = 'components';
        comp.fromJSON(components[key], factory);
        this.addComponent(comp);
      });
    }

    if (data.groups) {
      const groups = data.groups as string[];
      groups.forEach((path) => {
        const group = this.parent!.getByPath(path) as Group | null;
        if (group) {
          this.attachGroup(group);
        }
      });
    }
  }

  get _className(): string {
    return 'Node';
  }
}
