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
      const fromNow = JSON.parse(now);
      expect(JSON.parse(JSON.stringify(fromKMF))).toEqual(fromNow);
    });
  });

  it('kevoree.JavascriptNode.1', () => {
    return Promise.all([
      loadFile('kmf/kevoree.JavascriptNode.1.json'),
      loadFile('new/kevoree.JavascriptNode.1.json'),
    ]).then(([kmf, now]) => {
      const fromKMF = loader.parseKMF(kmf);
      const fromNow = JSON.parse(now);
      expect(JSON.parse(JSON.stringify(fromKMF))).toEqual(fromNow);
    });
  });

  it('kevoree.Ticker.1', () => {
    return Promise.all([
      loadFile('kmf/kevoree.Ticker.1.json'),
      loadFile('new/kevoree.Ticker.1.json'),
    ]).then(([kmf, now]) => {
      const fromKMF = loader.parseKMF(kmf);
      const fromNow = JSON.parse(now);
      expect(JSON.parse(JSON.stringify(fromKMF))).toEqual(fromNow);
    });
  });

  it('kevoree.kevoree-node-javascript.5.5.19', () => {
    return Promise.all([
      loadFile('kmf/kevoree.kevoree-node-javascript.5.5.19.json'),
      loadFile('new/kevoree.kevoree-node-javascript.5.5.19.json'),
    ]).then(([kmf, now]) => {
      const fromKMF = loader.parseKMF(kmf);
      const fromNow = JSON.parse(now);
      expect(JSON.parse(JSON.stringify(fromKMF))).toEqual(fromNow);
    });
  });
});
