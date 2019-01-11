<?php
  // Staging and production endpoints
  $staging_url = "" . $_SERVER['QUERY_STRING'];
  $staging_coll = 'staging_post';
  $prod_url = "" . $_SERVER['QUERY_STRING'];
  $prod_coll = 'prod_post';

  // Default to using production
  $selected_coll = $prod_coll;
  $selected_url  = $prod_url;

  // These triggers in the hostname will switch to the staging endpoint
  $staging_triggers = array ('dev', 'stg', 'dev4','localhost');

  $requester = $_SERVER['HTTP_HOST'];
  foreach($staging_triggers as $trigger) {
    if(strpos($requester, $trigger) !== false) {
      $selected_coll = $staging_coll;
      $selected_url  = $staging_url;
      break;
    }
  }

  // The solr endpoint with auth
  $url = str_replace("{selected_coll}", $selected_coll, $selected_url);

  $ch = curl_init($url);

  // Return the output of curl as a string (don't output to requester)
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $result = curl_exec($ch);
  $content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
  curl_close($ch);
         
  header("Content-Type: $content_type");
  echo $result;
?> 
