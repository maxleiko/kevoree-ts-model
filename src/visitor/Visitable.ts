import { KevoreeVisitor } from './KevoreeVisitor';

export interface Visitable {
  visit(visitor: KevoreeVisitor): void;
}
