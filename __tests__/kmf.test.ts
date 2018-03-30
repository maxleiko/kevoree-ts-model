import { JSONKevoreeLoader } from '../src/loader';
import { loadFile } from './utils/load-fixture';

describe('KMF converter', () => {
  const loader = new JSONKevoreeLoader();

  it('kevoree.JavaNode.2', () => {
    return Promise.all([loadFile('kmf/kevoree.JavaNode.2.json'), loadFile('new/kevoree.JavaNode.2.json')]).then(
      ([kmf, now]) => {
        const fromKMF = loader.parseKMF(kmf);
        const fromNow = loader.parse(now);
        expect(JSON.stringify(fromKMF, null, 2)).toEqual(JSON.stringify(fromNow, null, 2));
      },
    );
  });
});
