import '@ngneers/controls-custom-types';

declare module '@ngneers/controls-custom-types' {
  export interface NgnCustomTypes {
    icon: `img/icons/${'bars' | 'github' | 'code' | 'copy' | 'user'}.svg`;
    kind: {
      button: ['primary', 'secondary', 'icon', 'link', 'text', 'custom'];
    };
  }
}
