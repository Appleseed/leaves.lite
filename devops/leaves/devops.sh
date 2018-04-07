#!/bin/bash
set -e

docker-compose stop
docker-compose rm -f
docker-compose pull
docker-compose up --force-recreate -d
