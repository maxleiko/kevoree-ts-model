import { reaction } from 'mobx';

import { Element } from '../impl';

export function keyUpdater(elem: Element<any>, map: Map<string, Element<any>>) {
  if (!elem._key) {
    throw new Error('Cannot register key updater. Key is null');
  }
  const prevKey = elem._key;
  reaction(
    () => elem._key,
    (key) => {
      if (key) {
        map.delete(prevKey);
        map.set(key, elem);
      }
    },
  );
}
