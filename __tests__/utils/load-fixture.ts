import { readFile, readJson } from 'fs-extra';
import { resolve } from 'path';

const localResolve = (p: string) => resolve(__dirname, '..', 'fixtures', p);

export function loadJSON(fixture: string) {
  return readJson(localResolve(fixture));
}

export function loadFile(fixture: string) {
  return readFile(localResolve(fixture), 'utf8');
}