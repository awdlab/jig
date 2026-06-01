import type { InputMaskCfg } from './types';

const phoneNumber = [
  '(',
  { kind: 'number', segment: 'areaCode', min: 0, max: 999, length: 3, placeholder: '000' },
  ')',
  ' ',
  { kind: 'number', segment: 'exchange', min: 0, max: 999, length: 3, placeholder: '000' },
  '-',
  { kind: 'number', segment: 'subscriber', min: 0, max: 9999, length: 4, placeholder: '0000' },
] as const satisfies InputMaskCfg;

const creditCard = [
  { kind: 'number', segment: 'cardPart1', min: 0, max: 9999, length: 4, placeholder: '0000' },
  ' ',
  { kind: 'number', segment: 'cardPart2', min: 0, max: 9999, length: 4, placeholder: '0000' },
  ' ',
  { kind: 'number', segment: 'cardPart3', min: 0, max: 9999, length: 4, placeholder: '0000' },
  ' ',
  { kind: 'number', segment: 'cardPart4', min: 0, max: 9999, length: 4, placeholder: '0000' },
] as const satisfies InputMaskCfg;

const ssn = [
  { kind: 'number', segment: 'areaNumber', min: 0, max: 999, length: 3, placeholder: '000' },
  '-',
  { kind: 'number', segment: 'groupNumber', min: 0, max: 99, length: 2, placeholder: '00' },
  '-',
  { kind: 'number', segment: 'serialNumber', min: 0, max: 9999, length: 4, placeholder: '0000' },
] as const satisfies InputMaskCfg;

const zipCode = [
  { kind: 'number', segment: 'zipBase', min: 0, max: 99999, length: 5, placeholder: '00000' },
  '-',
  { kind: 'number', segment: 'zipPlus4', min: 0, max: 9999, length: 4, placeholder: '0000' },
] as const satisfies InputMaskCfg;

const currency = [
  '$',
  {
    kind: 'number',
    segment: 'dollars',
    min: 0,
    max: 999999999,
    length: 9,
    placeholder: '000000000',
  },
  '.',
  { kind: 'number', segment: 'cents', min: 0, max: 99, length: 2, placeholder: '00' },
] as const satisfies InputMaskCfg;

const percentage = [
  { kind: 'number', segment: 'percent', min: 0, max: 100, length: 3, placeholder: '000' },
  '%',
] as const satisfies InputMaskCfg;

export const MASKS = {
  phoneNumber,
  creditCard,
  ssn,
  zipCode,
  currency,
  percentage,
} as const satisfies Record<string, InputMaskCfg>;
