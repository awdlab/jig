import { transformToSelectOptions } from '@ngneers/controls/select';

export const options = [
  { id: 'de', label: 'Germany' },
  { id: 'fr', label: 'France' },
  { id: 'es', label: 'Spain' },
  { id: 'it', label: 'Italy' },
  { id: 'us', label: 'United States' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'jp', label: 'Japan' },
  { id: 'cn', label: 'China' },
  { id: 'in', label: 'India' },
];

export const optionsGrouped = [
  {
    label: 'Europe',
    id: 'europe',
    items: [
      { id: 'de', label: 'Germany' },
      { id: 'fr', label: 'France' },
      { id: 'es', label: 'Spain' },
      { id: 'it', label: 'Italy' },
    ],
  },
  {
    label: 'North America',
    id: 'north-america',
    items: [
      { id: 'us', label: 'United States' },
      { id: 'ca', label: 'Canada' },
    ],
  },
  {
    label: 'Asia',
    id: 'asia',
    items: [
      { id: 'jp', label: 'Japan' },
      { id: 'cn', label: 'China' },
      { id: 'in', label: 'India' },
    ],
  },
];

export const optionsPreformatted = transformToSelectOptions(options, {
  value: 'id',
  label: 'label',
});
export const optionsGroupedPreformatted = transformToSelectOptions(optionsGrouped, {
  value: 'id',
  label: 'label',
  groupItems: 'items',
});
