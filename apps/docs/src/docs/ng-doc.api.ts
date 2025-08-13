import { NgDocApi } from '@ng-doc/core';

const Api: NgDocApi = {
  title: 'API References',
  scopes: [
    {
      name: 'ngneers-controls',
      route: 'ngneers-controls',
      include: '../../packages/controls/src/**/*.ts',
    },
  ],
  order: 30,
};

export default Api;
