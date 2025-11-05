import '@ngneers/controls/custom-types';

declare module '@ngneers/controls/custom-types' {
  export interface NgnCustomTypes {
    kind: {
      button: 'primary' | 'secondary' | 'icon' | 'link' | 'text' | 'custom';
    };
  }
}
