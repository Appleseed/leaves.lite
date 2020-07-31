(function (window) {
  window.__env = window.__env || {};

  // development
  window.__env.LEAVES_API_URL =  'https://admin.dev.leaves.anant.us/';
  window.__env.LEAVES_API_ACCESSTOKEN = 'XXXXXX';
  //window.__env.LEAVES_API_URL = window.__env.LEAVES_API_URL
  //window.__env.LEAVES_API_ACCESSTOKEN = window.__env.LEAVES_API_ACCESSTOKEN;

  window.__env.LEAVES_TAG_API_URL =  'https://admin.dev.leaves.anant.us/';
  // staging
  // window.__env.LEAVES_API_URL = 'http://stage.leaves.anant.us/wb';


  // production  
  // window.__env.LEAVES_API_URL = 'https://leaves.anant.us:82';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.BITLY_API_ACCESSTOKEN = 'XXXXXX';

}(this));