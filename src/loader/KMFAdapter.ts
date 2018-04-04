import { JSONObject } from '../impl';

const propAdapter: any = {
  _className: 'class',
  metas: (parent: any) => {
    if (parent.filters) {
      return 'filters';
    }
    return 'metaData';
  },
  dictionary: 'dictionaryType',
  inputs: 'provided',
  outputs: 'required',
  hash: 'hashcode',
};

function kmfToPort(val: any[]) {
  const ports: any = {};
  val.forEach((port) => {
    ports[port.name] = new Proxy(port, handler);
  });
  return ports;
}

/**
 * Values passed to this object methods are the ones from KMF
 * The goal is to transform them in order to comply with the new model
 */
const objAdapter: any = {
  _className: (val: string) => {
    if (val.startsWith('org.kevoree.NodeType')) {
      return 'NodeType';
    }
    if (val.startsWith('org.kevoree.ComponentType')) {
      return 'ComponentType';
    }
    if (val.startsWith('org.kevoree.GroupType')) {
      return 'GroupType';
    }
    if (val.startsWith('org.kevoree.ChannelType')) {
      return 'ChannelType';
    }
    if (val.startsWith('org.kevoree.DictionaryAttribute')) {
      return 'ParamType';
    }
    if (val.startsWith('org.kevoree.DeployUnit')) {
      return 'DeployUnit';
    }
    if (val.startsWith('org.kevoree.Value')) {
      return 'Value';
    }
    return val;
  },
  version: (val: string, parent: any) => {
    if (parent.class.startsWith('org.kevoree.DeployUnit')) {
      return val;
    }
    return parseInt(val, 10);
  },
  fragmentDependant: (val: string) => val === 'true',
  dictionary: (val: any[]) => {
    if (val.length > 0) {
      const dictionary: any = {};
      val[0].attributes.forEach((attr: any) => {
        dictionary[attr.name] = new Proxy(attr, handler);
      });
      return dictionary;
    }
    return {};
  },
  outputs: kmfToPort,
  inputs: kmfToPort,
};

const handler: ProxyHandler<JSONObject> = {
  get: (obj, prop) => {
    // map new prop to KMF's prop if needed
    let adaptedProp;
    if (typeof propAdapter[prop] === 'function') {
      adaptedProp = propAdapter[prop](obj);
    } else {
      adaptedProp = propAdapter[prop] || prop;
    }
    // retrieve KMF's value
    const kmfValue = obj[adaptedProp];
    // adapt value to new value if needed
    return objAdapter[prop] ? objAdapter[prop](kmfValue, obj) : kmfValue;
  },
};

export function kmfAdapter(o: JSONObject): JSONObject {
  return new Proxy(o, handler);
}
