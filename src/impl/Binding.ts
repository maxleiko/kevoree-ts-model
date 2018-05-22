import { observable, computed, action } from 'mobx';

import { hash } from '../utils';
import { JSONObject } from './Element';
import { Channel } from './Channel';
import { Port } from './Port';
import { Model } from './Model';
import { KevoreeFactory } from '../factory';
import { ChildElement } from './ChildElement';

export class Binding extends ChildElement<Model> {
  @observable private _channel: Channel | null = null;
  @observable private _port: Port | null = null;

  @computed
  get channel() {
    return this._channel;
  }

  set channel(chan: Channel | null) {
    if (chan && this._port) {
      if (this._channel) {
        this._channel.removeBinding(this._key!);
      }
      this._channel = chan;
      chan.addBinding(this);
    } else {
      throw new Error(
        `Cannot set a binding's channel if binding's port is null (use withChannelAndPort(...))`,
      );
    }
  }

  @computed
  get port() {
    return this._port;
  }

  set port(port: Port | null) {
    if (port && this._channel) {
      if (this._port) {
        this._port.removeBinding(this._key!);
      }
      this._port = port;
      port.addBinding(this);
    } else {
      throw new Error(
        `Cannot set a binding's port if binding's channel is null (use withChannelAndPort(...))`,
      );
    }
  }

  @computed
  get _key(): string | null {
    if (this.deleting) {
      try {
        return this._generateKey();
      } catch {
        // ignore key error when deleting
        return null;
      }
    }
    return this._generateKey();
  }

  @action
  withChannelAndPort(channel: Channel, port: Port): this {
    if (this._channel) {
      if (this._port) {
        this._channel.removeBinding(this._key!);
        this._port.removeBinding(this._key!);
      }
    }
    this._channel = channel;
    this._port = port;
    channel.addBinding(this);
    port.addBinding(this);
    return this;
  }

  toJSON(key?: any) {
    return {
      ...super.toJSON(key),
      channel: this._channel ? this._channel.path : null,
      port: this._port ? this._port.path : null,
    };
  }

  fromJSON(data: JSONObject, _factory: KevoreeFactory) {
    if (data.channel) {
      const c = this.parent!.getByPath(data.channel as string) as Channel | null;
      if (c) {
        this._channel = c;
      }
    }
    if (data.port) {
      const p = this.parent!.getByPath(data.port as string) as Port | null;
      if (p) {
        this._port = p;
      }
    }
  }

  @action
  delete(): void {
    super.delete();
    if (this._channel && this._port) {
      this._channel.removeBinding(this._key!);
      this._port.removeBinding(this._key!);
      this._port = null;
      this._channel = null;
    }
  }

  get _className(): string {
    return 'Binding';
  }

  private _generateKey() {
    if (this._channel && this._port) {
      if (this._channel._key && this._port._key) {
        return hash(`${this._channel._key}_${this._port._key}`);
      }
      throw new Error('Cannot get binding key: channel.key & port.key must be set');
    }
    throw new Error('Cannot get binding key: channel & port must be set');
  }
}
