import { createTheme } from './theme';
import { createThemePart, css } from './theme-part';
import { createThemePartTemplate } from './theme-part-template';

const colors = createThemePartTemplate({
  scope: 'colors',
  variables: {
    primary: {
      light: null,
      dark: null,
    },
  },
  classNames: [],
});

const button = createThemePartTemplate({
  scope: 'button',
  variables: {
    backgroundColor: { primary: null, secondary: null },
    color: { primary: null, secondary: null },
    borderColor: { primary: null, secondary: null },
    padding: null,
  },
  classNames: ['primary', 'secondary'],
});

const colorsTheme = createThemePart({
  template: colors,
});

const buttonVariables = createThemePart({
  template: button,
  dependencies: [colors],
  root: {
    variables: {
      backgroundColor: {
        primary: '',
      },
    },
  },
});

const buttonStyles = createThemePart({
  template: button,
  root: {
    css: ({ v, c }) => css`
      .${c()} {
        padding: ${v('button.padding')};
      }
      .${c()}, .${c('primary')} {
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
  },
});

const buttonTheme = [buttonVariables, buttonStyles] as const;

const theme = createTheme([colorsTheme, buttonTheme]);

// TODO: Implement generation of CSS from theme
