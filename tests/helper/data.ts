import { transformToNgnItems } from '@ngneers/controls/api';

const itemsGrouped = [
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
] as const;

const items = itemsGrouped.map(group => group.items).flat();

const flatGroupedItems = itemsGrouped.flatMap(group => [group, ...group.items]) as (
  (typeof itemsGrouped)[number] | (typeof itemsGrouped)[number]['items'][number]
)[];

const itemsPreformatted = transformToNgnItems(items, {
  value: 'id',
  label: 'label',
  testId: 'id',
});

const itemsGroupedPreformatted = transformToNgnItems(itemsGrouped, {
  value: 'id',
  label: 'label',
  children: 'items',
  testId: 'id',
});

const loremIpsumFull =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.  \nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.  \nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.  \nNam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.  \nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.   \nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.  \nConsetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.  \nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.  \nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.  \nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.  \nNam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.';

export const exampleData = {
  items: {
    flat: items,
    flatGrouped: flatGroupedItems,
    grouped: itemsGrouped,
    flatPreformatted: itemsPreformatted,
    groupedPreformatted: itemsGroupedPreformatted,
  },
  loremIpsum: {
    full: loremIpsumFull,
    words100: loremIpsumFull.split(' ').slice(0, 100).join(' '),
  },
};
