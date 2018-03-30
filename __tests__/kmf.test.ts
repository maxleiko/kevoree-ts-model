import { JSONKevoreeLoader } from '../src/loader';
import { loadFile } from './utils/load-fixture';

describe('KMF converter', () => {
  const loader = new JSONKevoreeLoader();

  it('kevoree.JavaNode.2', () => {
    return Promise.all([
      loadFile('kmf/kevoree.JavaNode.2.json'),
      loadFile('new/kevoree.JavaNode.2.json'),
    ]).then(([kmf, now]) => {
      const fromKMF = loader.parseKMF(kmf);
      const fromNow = loader.parse(now);
      expect(JSON.parse(JSON.stringify(fromKMF))).toEqual(JSON.parse(JSON.stringify(fromNow)));
    });
  });

  it('kevoree.Ticker.1', () => {
    return Promise.all([
      loadFile('kmf/kevoree.Ticker.1.json'),
      loadFile('new/kevoree.Ticker.1.json'),
    ]).then(([kmf, now]) => {
      const fromKMF = loader.parseKMF(kmf);
      const fromNow = loader.parse(now);
      expect(JSON.parse(JSON.stringify(fromKMF))).toEqual(JSON.parse(JSON.stringify(fromNow)));
    });
  });
});
