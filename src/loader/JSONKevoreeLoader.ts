import { KevoreeLoader } from './KevoreeLoader';
import { kmfAdapter } from './KMFAdapter';
import { Element, JSONObject } from '../impl';
import { KevoreeFactory, DefaultKevoreeFactory } from '../factory';

export class JSONKevoreeLoader implements KevoreeLoader {
  constructor(private _factory: KevoreeFactory = new DefaultKevoreeFactory()) {}

  parse<T extends Element = Element>(data: string | JSONObject): T {
    let o;
    if (typeof data === 'string') {
      o = this.parseData(data);
    } else {
      o = data;
    }
    const elem = this.createElement<T>(o);
    elem.fromJSON(o, this._factory);
    return elem;
  }

  parseKMF<T extends Element = Element>(data: string): T {
    return this.parse(kmfAdapter(this.parseData(data)));
  }

  private parseData(data: string): JSONObject {
    let o;
    try {
      o = JSON.parse(data);
    } catch (err) {
      err.message = `Unable to parse JSON string. Malformed data?`;
      throw err;
    }
    if (typeof o === 'object') {
      return o;
    }
    throw new Error(
      `JSONKevoreeLoader expects a JSON object in order to load the model (given: ${typeof o})`,
    );
  }

  private createElement<T extends Element = Element>(data: JSONObject): T {
    let elem: T;
    try {
      elem = (this._factory as any)[`create${data._className}`]();
    } catch (err) {
      err.message = `The KevoreeFactory is unable to create an instance of "${data._className}"`;
      throw err;
    }
    return elem;
  }
}
