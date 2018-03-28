import { Element } from '../impl/Element';

export interface KevoreeSerializer {
  stringify(elem: Element<any>, space?: string | number): string;
}