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
import { KevoreeFactory } from './KevoreeFactory';
import { TypeDefinition } from '..';

export class DefaultKevoreeFactory implements KevoreeFactory {
  createBinding(): Binding {
    return new Binding();
  }
  createChannel(): Channel {
    return new Channel();
  }
  createChannelType(): ChannelType {
    return new ChannelType();
  }
  createComponent(): Component {
    return new Component();
  }
  createComponentType(): ComponentType {
    return new ComponentType();
  }
  createDeployUnit(): DeployUnit {
    return new DeployUnit();
  }
  createGroup(): Group {
    return new Group();
  }
  createGroupType(): GroupType {
    return new GroupType();
  }
  createNamespace(): Namespace {
    return new Namespace();
  }
  createModel(): Model {
    return new Model();
  }
  createNode(): Node {
    return new Node();
  }
  createNodeType(): NodeType {
    return new NodeType();
  }
  createParamType<P extends TypeDefinition = TypeDefinition>(): ParamType<P> {
    return new ParamType<P>();
  }
  createPort(): Port {
    return new Port();
  }
  createPortType(): PortType {
    return new PortType();
  }
  createValue<P extends Element>(): Value<P> {
    return new Value<P>();
  }
}
