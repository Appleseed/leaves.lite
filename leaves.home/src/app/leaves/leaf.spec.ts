/// <reference path="../../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {leaf} from './leaf';

describe('leaf component', () => {
  beforeEach(() => {
    angular
      .module('appleseedLeaf', ['app/leaves/leaf.html'])
      .component('appleseedLeaf', leaf);
    angular.mock.module('appleseedLeaf');
  });

  interface IMyScope extends ng.IScope {
    fixture: any;
  }

  it('should render Gulp', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) => {
    const $scope: IMyScope = <IMyScope> $rootScope.$new();
    $scope.fixture = {
    area: 'content-left',
    name: 'Codementor',
    path: 'https://www.codementor.io',
    ContentImages_small: '',
    ContentImages_large: '',
    title: 'Codementor',
    content: 'Docker started off as a side project at dotCloud, a Platform-as-a-Service company often compared to Heroku. I think it’s really cool how their business took off after making Docker their main focus.',
    category: 'Training',
    tags: ['docker', 'introduction', 'tutorials'],
    type: 'Page',
    source: 'Codementor'
    };
    const element = $compile('<appleseed-leaf leaf="fixture"></appleseed-leaf>')($scope);
    $scope.$digest();
    const leaf = element.find('h3');
    expect(leaf.html().trim()).toEqual('<a href="https://www.codementor.io" class="ng-binding">Codementor</a>');
  }));
});
