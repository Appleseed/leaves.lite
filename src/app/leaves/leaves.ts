class Leaf {
  constructor(
    public area: string,
    public name: string,
    public path: string,
    public title: string,
    public content: string,
    public category: string,
    public tags: string[],
    public type: string,
    public source: string,
    public ContentImages_small: string,
    public ContentImages_large: string
  ) {}
}

class LeavesController {
  public leaves: Leaf[];
  public twig: string;
  public twigName: string;

  /** @ngInject */
  constructor(private $http: angular.IHttpService) {
    var twigFilter = this.twig;
    $http
      .get('app/data/topics.docker.json')
      .then(response => {
        var allLeaves = response.data as Leaf[];
        this.leaves = allLeaves.filter( function (leaf: Leaf) {
          return leaf.area === twigFilter;
        });
      });
  }
}

export const leaves: angular.IComponentOptions = {
  template: require('./leaves.html'),
  controller: LeavesController,
  bindings: {
    twig: '<',
    twigName: '<'
  }
};
