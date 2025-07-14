import '@ngneers/controls/custom-types';

declare module '@ngneers/controls/custom-types' {
  export interface NgnCustomTypes {
    icon: string;
    kind: {
      button: 'primary' | 'secondary' | 'text' | 'link' | 'icon';
    };
  }
}
