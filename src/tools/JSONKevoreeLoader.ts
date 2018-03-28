import { KevoreeLoader } from './KevoreeLoader';
import { Element } from '../impl/Element';
import { KevoreeFactory } from './KevoreeFactory';
import { DefaultKevoreeFactory } from './DefaultKevoreeFactory';

export class JSONKevoreeLoader implements KevoreeLoader {

  constructor(private _factory: KevoreeFactory = new DefaultKevoreeFactory()) {}

  parse<T extends Element<any> = Element<any>>(data: string): T {
    const o = JSON.parse(data);
    let elem: T;
    try {
      elem = (this._factory as any)[`create${o._className}`]();
    } catch (err) {
      err.message = `The KevoreeFactory is unable to create an instance of "${o._className}"`;
      throw err;
    }
    elem.fromJSON(o, this._factory);
    return elem;
  }

  parseFromKMF(data: string): Element<any> | null {
    const o = JSON.parse(data);
    // TODO
    return null;
  }
}