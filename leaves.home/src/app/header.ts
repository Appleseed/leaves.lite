class HeaderController {
  public branch: string;
  public branchName: string;

  /** @ngInject */
  constructor(private $http: angular.IHttpService) {
  }
}

export const header: angular.IComponentOptions = {
  template: require('./header.html'),
  controller: HeaderController,
  bindings : {
    branch : '<',
    branchName : '<'
  }
};
