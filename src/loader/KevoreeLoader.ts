import { Element, JSONObject } from '../impl';

export interface KevoreeLoader {
  parse<T extends Element = Element>(data: string | JSONObject): T;
}
