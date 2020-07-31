(function (window) {
    window.__env = window.__env || {};
  
    // development
    window.__env.LEAVES_API_URL =  'https://admin.leaves.anant.us/';
    window.__env.LEAVES_API_ACCESSTOKEN = 'XXXXXX';
    //window.__env.LEAVES_API_URL = window.__env.LEAVES_API_URL
    //window.__env.LEAVES_API_ACCESSTOKEN = window.__env.LEAVES_API_ACCESSTOKEN;
  
    window.__env.LEAVES_TAG_API_URL =  'https://admin.leaves.anant.us/';
    // staging
    // window.__env.LEAVES_API_URL = 'http://stage.leaves.anant.us/wb';
  
  
    // production  
    // window.__env.LEAVES_API_URL = 'https://leaves.anant.us:82';
    
    window.__env.PROD_GA_ID = 'UA-125368255-3';
    window.__env.STAGE_GA_ID = 'UA-125628317-1';
    window.__env.DEV_GA_ID = 'UA-657559-23';

    window.__env.PTCODE_ID = '35ee64ef';
    // window.__env.GA_ID = 'UA-657559-23'
    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.BITLY_API_ACCESSTOKEN = 'XXXXXX';
  
}(this));
