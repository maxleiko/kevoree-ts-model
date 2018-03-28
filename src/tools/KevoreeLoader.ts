import { Element } from '../impl/Element';

export interface KevoreeLoader {
  parse<T extends Element<any> = Element<any>>(data: string): T;
}