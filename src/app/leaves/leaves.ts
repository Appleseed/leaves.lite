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

class Twig {
  constructor(
    public area: string,
    public name: string
  ){}
}

class LeavesController {
  public leavesData : Leaf[];
  public leavesItems: Leaf[];
  public twig: Twig;

  $onInit(): void {
      //console.dir(this.twig);
      console.log(this.twig.area);

      //TODO: these can't run because leavesData hasn't been populated by this point. 
      //this.filterLeaves(this.twig.area);

      //TODO: make this wait until its ready and then try again
  } 
  /** @ngInject */
  constructor(private $http: angular.IHttpService) {
    console.log("in constructor - twiddling");

    $http
      .get('app/data/topics.docker.json')
      .then(response => {
        console.log("got data");
        var allLeaves = response.data as Leaf[];
        this.leavesData = allLeaves;
        this.bindLeaves();
      });
    
  }

  public bindLeaves(){
    this.leavesItems = this.leavesData;
  }

  public filterLeaves(filter:string){
    this.leavesItems = this.leavesData.filter( function (leaf: Leaf) {
          return leaf.area == filter;
    });
  }
}

export const leaves: angular.IComponentOptions = {
  template: require('./leaves.html'),
  controller: LeavesController,
  bindings: {
    twig: '<',
    twigName: '='
  }
};
