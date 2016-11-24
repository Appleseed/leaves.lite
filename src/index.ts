/// <reference path="../typings/index.d.ts" />

import * as angular from 'angular';

import {leavesModule} from './app/leaves/index';
import 'angular-ui-router';
import routesConfig from './routes';

import {main} from './app/main';
import {header} from './app/header';
import {title} from './app/title';
import {footer} from './app/footer';

import './index.css';

angular
  .module('app', [leavesModule, 'ui.router'])
  .config(routesConfig)
  .component('app', main)
  .component('appleseedHeader', header)
  .component('appleseedTitle', title)
  .component('appleseedFooter', footer);
