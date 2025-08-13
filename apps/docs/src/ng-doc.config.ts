import { NgDocConfiguration } from '@ng-doc/builder';

const config: NgDocConfiguration = {
  repoConfig: {
    url: 'https://github.com/ngneers/controls',
    mainBranch: 'main',
    releaseBranch: 'release',
    platform: 'github',
  },
  routePrefix: 'docs',
  docsPath: 'src/docs',
};

export default config;
