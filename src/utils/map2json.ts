export function map2json(map: Map<string, any>): { [s: string]: any } {
  const res: { [s: string]: any } = {};
  map.forEach((e) => {
    if (res[e._key] instanceof Map) {
      res[e._key] = map2json(res[e._key]);
    } else {
      res[e._key] = e.toJSON();
    }
  });
  return res;
}