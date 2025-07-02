import { transformToNgnItems } from '@ngneers/controls/api';

export const optionsGrouped = [
  {
    label: 'Africa',
    id: 'africa',
    items: [
      { id: 'ng', label: 'Nigeria' },
      { id: 'eg', label: 'Egypt' },
      { id: 'za', label: 'South Africa' },
      { id: 'ke', label: 'Kenya' },
      { id: 'et', label: 'Ethiopia' },
      { id: 'dz', label: 'Algeria' },
      { id: 'ma', label: 'Morocco' },
      { id: 'gh', label: 'Ghana' },
    ],
  },
  {
    label: 'Antarctica',
    id: 'antarctica',
    items: [{ id: 'aq', label: 'Antarctica' }],
  },
  {
    label: 'Asia',
    id: 'asia',
    items: [
      { id: 'cn', label: 'China' },
      { id: 'in', label: 'India' },
      { id: 'jp', label: 'Japan' },
      { id: 'id', label: 'Indonesia' },
      { id: 'pk', label: 'Pakistan' },
      { id: 'bd', label: 'Bangladesh' },
      { id: 'ru', label: 'Russia' },
      { id: 'tr', label: 'Turkey' },
      { id: 'kr', label: 'South Korea' },
      { id: 'th', label: 'Thailand' },
    ],
  },
  {
    label: 'Europe',
    id: 'europe',
    items: [
      { id: 'de', label: 'Germany' },
      { id: 'fr', label: 'France' },
      { id: 'es', label: 'Spain' },
      { id: 'it', label: 'Italy' },
      { id: 'gb', label: 'United Kingdom' },
      { id: 'nl', label: 'Netherlands' },
      { id: 'se', label: 'Sweden' },
      { id: 'pl', label: 'Poland' },
      { id: 'ua', label: 'Ukraine' },
      { id: 'gr', label: 'Greece' },
    ],
  },
  {
    label: 'North America',
    id: 'north-america',
    items: [
      { id: 'us', label: 'United States' },
      { id: 'ca', label: 'Canada' },
      { id: 'mx', label: 'Mexico' },
      { id: 'cu', label: 'Cuba' },
      { id: 'jm', label: 'Jamaica' },
      { id: 'gt', label: 'Guatemala' },
      { id: 'ht', label: 'Haiti' },
    ],
  },
  {
    label: 'Oceania',
    id: 'oceania',
    items: [
      { id: 'au', label: 'Australia' },
      { id: 'nz', label: 'New Zealand' },
      { id: 'fj', label: 'Fiji' },
      { id: 'pg', label: 'Papua New Guinea' },
      { id: 'sb', label: 'Solomon Islands' },
    ],
  },
  {
    label: 'South America',
    id: 'south-america',
    items: [
      { id: 'br', label: 'Brazil' },
      { id: 'ar', label: 'Argentina' },
      { id: 'co', label: 'Colombia' },
      { id: 'pe', label: 'Peru' },
      { id: 've', label: 'Venezuela' },
      { id: 'cl', label: 'Chile' },
      { id: 'ec', label: 'Ecuador' },
    ],
  },
];

export const options = optionsGrouped.flatMap(group => group.items);

export const optionsPreformatted = transformToNgnItems(options, {
  value: 'id',
  label: 'label',
});

export const optionsGroupedPreformatted = transformToNgnItems(optionsGrouped, {
  value: 'id',
  label: 'label',
  groupItems: 'items',
});
