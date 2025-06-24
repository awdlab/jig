import { createTheme } from './theme';
import { createThemePart, css } from './theme-part';
import { createThemePartTemplate } from './theme-part-template';

const colors = createThemePartTemplate({
  scope: 'colors',
  variables: {
    primary: {
      light: undefined,
      dark: undefined,
    },
  },
  classNames: [],
});

const button = createThemePartTemplate({
  scope: 'button',
  variables: {
    backgroundColor: { primary: undefined, secondary: undefined },
    color: { primary: undefined, secondary: undefined },
    borderColor: { primary: undefined, secondary: undefined },
  },
  classNames: ['', 'primary', 'secondary'],
});

const colorsTheme = createThemePart({
  template: colors,
});

const buttonTheme = createThemePart({
  template: button,
  dependencies: [colors],
  variables: {
    backgroundColor: {
      primary: '',
    },
  },
  css: ({ v, c }) => css`
    .${c('')}, .${c('primary')} {
      background-color: ${v('button.backgroundColor.primary')};
      color: ${v('button.color.primary')};
      border-color: ${v('button.borderColor.primary')};
    }
    .${c('secondary')} {
      background-color: ${v('button.backgroundColor.secondary')};
      color: ${v('button.color.secondary')};
      border-color: ${v('button.borderColor.secondary')};
    }
  `,
});

const theme = createTheme([colorsTheme, buttonTheme]);

// TODO: Implement generation of CSS from theme
