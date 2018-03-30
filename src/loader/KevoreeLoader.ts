import { Element, JSONObject } from '../impl';

export interface KevoreeLoader {
  parse<T extends Element<any> = Element<any>>(data: string | JSONObject): T;
}