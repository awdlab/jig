import { InputMaskCfg } from './types';

const time = [
  {
    accepts: /^\d$/,
    default: '0',
    placeholder: 'H',
  },
  {
    accepts: /^\d$/,
    default: '0',
    placeholder: 'H',
  },
  ':',
  {
    accepts: /^\d$/,
    default: '0',
    placeholder: 'M',
  },
  {
    accepts: /^\d$/,
    default: '0',
    placeholder: 'M',
  },
] as const satisfies InputMaskCfg;

const timeSeconds = [
  ...time,
  ':',
  {
    accepts: /^\d$/,
    default: '0',
    placeholder: 'S',
  },
  {
    accepts: /^\d$/,
    default: '0',
    placeholder: 'S',
  },
] as const satisfies InputMaskCfg;

export const MASKS = {
  time,
  timeSeconds,
} as const satisfies Record<string, InputMaskCfg>;
