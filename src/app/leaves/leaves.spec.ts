/// <reference path="../../../typings/index.d.ts" />

import * as angular from 'angular';
import 'angular-mocks';
import {leaves} from './leaves';

const leavesJson = [
  {
    area: 'content-left',
    name: 'DOCKER: Self Paced Training',
    path: 'https://training.docker.com/self-paced-training',
    ContentImages_small: '',
    ContentImages_large: '',
    title: 'DOCKER: Self Paced Training',
    content: 'Docker\'s own self paced training class.',
    category: 'Training',
    tags: ['docker', 'video'],
    type: 'Video',
    source: 'Docker'
  },
  {
    area: 'content-left',
    name: 'Hackr.io : Learn Docker',
    path: 'https://hackr.io/tutorials/learn-docker',
    ContentImages_small: '',
    ContentImages_large: '',
    title: 'Hackr.io : Learn Docker',
    content: 'Listing of docker tutorials submitted and voted on by the programming community',
    category: 'Training',
    tags: ['docker', 'tutorials'],
    type: 'Page',
    source: 'Docker'
  },
  {
    area: 'content-left',
    name: 'Codementor : Introduction to Docker',
    path: 'https://www.codementor.io/docker/tutorial/what-is-docker-tutorial-andrew-baker-oreilly',
    ContentImages_small: '',
    ContentImages_large: '',
    title: 'An Introduction to Docker by Instructor of O’Reilly’s Docker Tutorial',
    content: 'Docker started off as a side project at dotCloud, a Platform-as-a-Service company often compared to Heroku. I think it’s really cool how their business took off after making Docker their main focus.',
    category: 'Training',
    tags: ['docker', 'introduction', 'tutorials'],
    type: 'Page',
    source: 'Codementor'
  },
  ];

describe('leaves component', () => {
  beforeEach(() => {
    angular
      .module('appleseedLeaves', ['app/leaves/leaves.html'])
      .component('appleseedLeaves', leaves);
    angular.mock.module('appleseedLeaves');
  });

  it('should render 3 elements <appleseed-leaf>', angular.mock.inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService, $httpBackend: ng.IHttpBackendService) => {
    $httpBackend.when('GET', 'app/data/topics.docker.json').respond(leavesJson);
    const element = $compile('<appleseed-leaves twig="\'content-left\'" twig-name="\'Content\'"></appleseed-leaves>')($rootScope);
    $httpBackend.flush();
    $rootScope.$digest();
    const leaves = element.find('appleseed-leaf');
    expect(leaves.length).toEqual(3);
  }));
});
