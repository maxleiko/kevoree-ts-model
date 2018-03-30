import {
  Model,
  Node,
  Group,
  Channel,
  Binding,
  Namespace,
  Component,
  ChannelType,
  ComponentType,
  NodeType,
  GroupType,
  ParamType,
  Port,
  Instance,
  DeployUnit,
  TypeDefinition,
  Named,
  Element
} from '../impl';

export interface KevoreeVisitor {
  visitModel(model: Model): void;
  visitNode(node: Node): void;
  visitGroup(group: Group): void;
  visitChannel(channel: Channel): void;
  visitBinding(binding: Binding): void;
  visitNamespace(ns: Namespace): void;
  visitPort(port: Port): void;
  visitComponent(comp: Component): void;
  visitChannelType(type: ChannelType): void;
  visitComponentType(type: ComponentType): void;
  visitNodeType(type: NodeType): void;
  visitGroupType(type: GroupType): void;
  visitParamType(type: ParamType): void;
  visitInstance(instance: Instance): void;
  visitDeployUnit(du: DeployUnit): void;
  visitTypeDefinition(tdef: TypeDefinition): void;
  visitNamed(named: Named): void;
  visitElement(elem: Element): void;
}
