import { ngnGlobal } from './globals';

const idPrefix = 'ngn-element-id-';

export function generateElementId() {
  return idPrefix + ngnGlobal.nextElementId++;
}
