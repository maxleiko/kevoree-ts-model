import { Named } from './Named';
import { ComponentType } from './ComponentType';

export class PortType extends Named<ComponentType> {
  get _className(): string {
    return 'PortType';
  }
}
