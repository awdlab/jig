export interface GalleryEntry {
  name: string;
  route: string;
}

/** Curated controls for the startpage gallery. */
export const GALLERY: GalleryEntry[] = [
  { name: 'Button', route: '/components/button' },
  { name: 'Switch', route: '/components/switch' },
  { name: 'Slider', route: '/components/slider' },
  { name: 'Select', route: '/components/select' },
  { name: 'Chip', route: '/components/chip' },
  { name: 'Tag', route: '/components/tag' },
  { name: 'Avatar', route: '/components/avatar' },
  { name: 'Progress', route: '/components/progress' },
  { name: 'Tooltip', route: '/components/tooltip' },
  { name: 'Checkbox', route: '/components/checkbox' },
  { name: 'Tabs', route: '/components/tabs' },
  { name: 'Input', route: '/components/input' },
];
