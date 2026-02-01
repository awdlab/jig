import { type Config } from "prettier";
import base from '@ngneers/prettier-config';

const config: Config = {
  ...base,
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
