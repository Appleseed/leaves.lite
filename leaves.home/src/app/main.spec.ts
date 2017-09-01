/// <reference path="../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {main} from './main';

describe('main component', () => {
  beforeEach(() => {
    angular
      .module('app', ['app/main.html'])
      .component('app', main);
    angular.mock.module('app');
  });

  it('should render the header, title, leaves and footer', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<app></app>')($rootScope);
    $rootScope.$digest();
    expect(element.find('appleseed-header').length).toEqual(1);
    expect(element.find('appleseed-title').length).toEqual(1);
    expect(element.find('appleseed-leaves').length).toEqual(5);
    expect(element.find('appleseed-footer').length).toEqual(1);
  }));
});
