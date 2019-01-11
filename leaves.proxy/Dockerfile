#++++++++++++++++++++++++++++++++++++++
# Nginx Docker container
#++++++++++++++++++++++++++++++++++++++
#
# Official images:
#
#   nginx - Nginx Webserver
#           https://hub.docker.com/r/library/nginx/
#
#++++++++++++++++++++++++++++++++++++++

FROM nginx

RUN apt-get update && apt-get install -y net-tools


COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/solr_proxy.conf /etc/nginx/solr_proxy.conf