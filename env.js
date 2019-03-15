(function (window) {
  window.__env = window.__env || {};

  // development
  //window.__env.LEAVES_API_URL =  'https://dev.leaves.anant.us/wb';
  //window.__env.LEAVES_API_ACCESSTOKEN = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw';
  window.__env.LEAVES_API_URL = process.env.LEAVES_API_URL
  window.__env.LEAVES_API_ACCESSTOKEN = process.env.LEAVES_API_ACCESSTOKEN;

  window.__env.LEAVES_TAG_API_URL =  'https://dev.leaves.anant.us/';
  // staging
  // window.__env.LEAVES_API_URL = 'http://stage.leaves.anant.us/wb';
  // window.__env.LEAVES_API_ACCESSTOKEN = 'MjI0MjJlMjQ0ZjY0NzA2ZWIyOTljZTYxZDE1YjM1ZjVmYzU3ODMwMWFlYjgwZDY1MDNlYWJjYTBjNTEwMWE0Mg';


  // production  
  // window.__env.LEAVES_API_URL = 'https://leaves.anant.us:82';
  // window.__env.LEAVES_API_ACCESSTOKEN = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.BITLY_API_ACCESSTOKEN = '2902c7b1d82061bab0d8732473d3b37a4477a253';

}(this));