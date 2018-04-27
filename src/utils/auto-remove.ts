import { reaction, IReactionDisposer } from 'mobx';

import { Element } from '../impl';

/**
 * Automatically set target.ref = null when elem.deleting is true
 * @param elem the element to react to
 * @param target the target that has a ref to elem
 * @param ref the name of the property that holds elem
 */
export function autoRemove<P extends Element>(
  elem: Element,
  target: P,
  ref: keyof P,
): IReactionDisposer {
  return reaction(
    () => elem.deleting,
    (isDeleting, r) => {
      if (isDeleting) {
        (target as any)[ref] = null;
        r.dispose();
      }
    },
  );
}
