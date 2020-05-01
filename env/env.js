(function (window) {
    window.__env = window.__env || {};
  
    // development
    window.__env.LEAVES_API_URL =  'http://dev.leaves.anant.us/wb';
    window.__env.LEAVES_API_ACCESSTOKEN = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw';
    //window.__env.LEAVES_API_URL = window.__env.LEAVES_API_URL
    //window.__env.LEAVES_API_ACCESSTOKEN = window.__env.LEAVES_API_ACCESSTOKEN;
  
    window.__env.LEAVES_TAG_API_URL =  'http://dev.leaves.anant.us/';
    // staging
    // window.__env.LEAVES_API_URL = 'http://stage.leaves.anant.us/wb';
    // window.__env.LEAVES_API_ACCESSTOKEN = 'MjI0MjJlMjQ0ZjY0NzA2ZWIyOTljZTYxZDE1YjM1ZjVmYzU3ODMwMWFlYjgwZDY1MDNlYWJjYTBjNTEwMWE0Mg';
  
  
    // production  
    // window.__env.LEAVES_API_URL = 'https://leaves.anant.us:82';
    // window.__env.LEAVES_API_ACCESSTOKEN = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw';
    
    window.__env.PROD_GA_ID = 'UA-125368255-3';
    window.__env.STAGE_GA_ID = 'UA-125628317-1';
    window.__env.DEV_GA_ID = 'UA-657559-23';

    window.__env.PTCODE_ID = '35ee64ef';
    // window.__env.GA_ID = 'UA-657559-23'
    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.BITLY_API_ACCESSTOKEN = '2902c7b1d82061bab0d8732473d3b37a4477a253';
  
}(this));