import { NgnCustomTypes } from './custom-types';

export type IconType = NgnCustomTypes extends { icon: infer T } ? T : string;
