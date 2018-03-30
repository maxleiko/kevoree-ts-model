import { reaction, IReactionDisposer } from 'mobx';

import { Element } from '../impl';

/**
 * Automatically set parent.ref = null when elem.deleting is true
 * @param elem the element to react to
 * @param parent the parent that has a ref to elem
 * @param ref the name of the property that holds elem
 */
export function autoRemove<P extends Element<any>>(elem: Element<any>, parent: P, ref: keyof P): IReactionDisposer {
  return reaction(
    () => elem.deleting,
    (isDeleting, r) => {
      if (isDeleting) {
        (parent as any)[ref] = null;
        r.dispose();
      }
    },
  );
}
