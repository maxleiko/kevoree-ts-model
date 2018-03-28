import { observable, computed, action } from 'mobx';

import { hash } from '../utils';
import { Element } from './Element';
import { Channel } from './Channel';
import { Port } from './Port';
import { KevoreeFactory } from '../tools/KevoreeFactory';
import { Model } from './Model';

export class Binding extends Element<Model> {

  @observable private _channel: Channel | null = null;
  @observable private _port: Port | null = null;

  @computed get channel() {
    return this._channel;
  }

  set channel(chan: Channel | null) {
    this._channel = chan;
  }

  @computed get port() {
    return this._port;
  }

  set port(port: Port | null) {
    this._port = port;
  }

  @computed get _key(): string | null {
    if (this._channel && this._port) {
      if (this._channel._key && this._port._key) {
        return hash(`${this._channel._key}_${this._port._key}`);
      }
      throw new Error('Cannot get binding key: channel.key & port.key must be set');
    }
    throw new Error('Cannot get binding key: channel & port must be set');
  }

  @action withChannelAndPort(channel: Channel, port: Port): this {
    this._channel = channel;
    this._port = port;
    return this;
  }

  fromJSON(data: { [s: string]: any }, factory: KevoreeFactory) {
    // TODO how to handle refs?
  }

  get _className(): string {
    return 'Binding';
  }
}