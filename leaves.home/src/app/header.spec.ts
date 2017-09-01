/// <reference path="../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {header} from './header';

describe('header component', () => {
  beforeEach(() => {
    angular
      .module('appleseedHeader', ['app/header.html'])
      .component('appleseedHeader', header);
    angular.mock.module('appleseedHeader');
  });

  it('should render \'Topic Name\'', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<appleseed-header branch="\'docker\'" branch-name="\'Docker\'"></appleseed-header>')($rootScope);
    $rootScope.$digest();
    const header = element.find('a');
    expect(header.html().trim()).toEqual('Docker');
  }));
});
