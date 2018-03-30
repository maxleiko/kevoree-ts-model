import { observable, computed, action } from 'mobx';

import { hash, autoRemove } from '../utils';
import { Element, JSONObject } from './Element';
import { Channel } from './Channel';
import { Port } from './Port';
import { Model } from './Model';
import { KevoreeFactory } from '../factory';

export class Binding extends Element<Model> {
  @observable private _channel: Channel | null = null;
  @observable private _port: Port | null = null;

  @computed
  get channel() {
    return this._channel;
  }

  set channel(chan: Channel | null) {
    this._channel = chan;
    if (chan) {
      autoRemove<Binding>(chan, this, 'channel');
    }
  }

  @computed
  get port() {
    return this._port;
  }

  set port(port: Port | null) {
    this._port = port;
    if (port) {
      autoRemove<Binding>(port, this, 'port');
    }
  }

  @computed
  get _key(): string | null {
    if (this._channel && this._port) {
      if (this._channel._key && this._port._key) {
        return hash(`${this._channel._key}_${this._port._key}`);
      }
      throw new Error('Cannot get binding key: channel.key & port.key must be set');
    }
    throw new Error('Cannot get binding key: channel & port must be set');
  }

  @action
  withChannelAndPort(channel: Channel, port: Port): this {
    this.channel = channel;
    this.port = port;
    return this;
  }

  toJSON() {
    const o = super.toJSON();
    if (this._channel) {
      o.channel = this._channel.path;
    }
    if (this._port) {
      o.port = this._port.path;
    }
    return o;
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

  get _className(): string {
    return 'Binding';
  }
}
