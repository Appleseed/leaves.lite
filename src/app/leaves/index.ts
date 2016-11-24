import * as angular from 'angular';

import {leaf} from './leaf';
import {leaves} from './leaves';

export const leavesModule = 'leaves';

angular
  .module(leavesModule, [])
  .component('appleseedLeaf', leaf)
  .component('appleseedLeaves', leaves);
