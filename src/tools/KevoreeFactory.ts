import { Binding } from '../impl/Binding';
import { Channel } from '../impl/Channel';
import { ChannelType } from '../impl/ChannelType';
import { Component } from '../impl/Component';
import { ComponentType } from '../impl/ComponentType';
import { DeployUnit } from '../impl/DeployUnit';
import { Element } from '../impl/Element';
import { Group } from '../impl/Group';
import { GroupType } from '../impl/GroupType';
import { Namespace } from '../impl/Namespace';
import { Model } from '../impl/Model';
import { Node } from '../impl/Node';
import { NodeType } from '../impl/NodeType';
import { ParamType } from '../impl/ParamType';
import { Port } from '../impl/Port';
import { PortType } from '../impl/PortType';
import { Value } from '../impl/Value';

export interface KevoreeFactory {
  createBinding(): Binding;
  createChannel(): Channel;
  createChannelType(): ChannelType;
  createComponent(): Component;
  createComponentType(): ComponentType;
  createDeployUnit(): DeployUnit;
  createGroup(): Group;
  createGroupType(): GroupType;
  createNamespace(): Namespace;
  createModel(): Model;
  createNode(): Node;
  createNodeType(): NodeType;
  createParamType(): ParamType;
  createPort(): Port;
  createPortType(): PortType;
  createValue<P extends Element<any>>(): Value<P>;
}
