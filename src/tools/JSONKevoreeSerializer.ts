import { KevoreeSerializer } from './KevoreeSerializer';
import { Element } from '../impl/Element';

export class JSONKevoreeSerializer implements KevoreeSerializer {

  private _replacer: (key: string, value: any) => any;

  constructor() {
    this._replacer = (key, value) => {
      if (key === '_parent' && value) {
        return value.key;
      }
      return value;
    };
  }

  stringify(elem: Element<any>, space?: string | number): string {
    return JSON.stringify(elem, this._replacer, space);
  }
}