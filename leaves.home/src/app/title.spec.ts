/// <reference path="../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {title} from './title';

describe('title component', () => {
  beforeEach(() => {
    angular
      .module('appleseedTitle', ['app/title.html'])
      .component('appleseedTitle', title);
    angular.mock.module('appleseedTitle');
  });

  it('should render \'Appleseed Leaves', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<appleseed-title></appleseed-title>')($rootScope);
    $rootScope.$digest();
    const title = element.find('h1');
    expect(title.html().trim()).toEqual('Appleseed Leaves');
  }));
});
