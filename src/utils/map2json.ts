export function map2json(map: Map<string, any>): { [s: string]: any } {
  const res: { [s: string]: any } = {};
  map.forEach((e) => {
    res[e._key] = e.toJSON();
  });
  return res;
}