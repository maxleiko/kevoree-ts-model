import { reaction, IReactionDisposer } from 'mobx';

import { Element } from '../impl';

/**
 * Automatically deletes an element from the given map when its key changes and then re-adds it with the new key
 */
export function keyUpdater<T extends Element<any>>(elem: T, map: Map<string, T>): IReactionDisposer {
  if (!elem._key) {
    throw new Error('Cannot register key updater. Key is null');
  }
  const prevKey = elem._key;
  return reaction(
    () => elem._key,
    (key) => {
      if (key) {
        map.delete(prevKey);
        map.set(key, elem);
      }
    },
  );
}
