/// <reference path="../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {footer} from './footer';

describe('footer component', () => {
  beforeEach(() => {
    angular
      .module('appleseedFooter', ['app/footer.html'])
      .component('appleseedFooter', footer);
    angular.mock.module('appleseedFooter');
  });

  it('should render \'Anant team\'', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const element = $compile('<appleseed-footer></appleseed-footer>')($rootScope);
    $rootScope.$digest();
    const footer = element.find('a');
    expect(footer.html().trim()).toEqual('Anant team');
  }));
});
