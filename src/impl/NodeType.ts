import { TypeDefinition } from './TypeDefinition';

export class NodeType extends TypeDefinition {
  get _className(): string {
    return 'NodeType';
  }
}