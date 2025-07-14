import '@ngneers/controls/custom-types';

declare module '@ngneers/controls/custom-types' {
  export interface NgnCustomTypes {
    icon: {
      prefix: string;
      icon: string;
    };
    kind: {
      button: 'primary' | 'secondary' | 'text' | 'link';
    };
  }
}
