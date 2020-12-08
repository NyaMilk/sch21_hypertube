#!/bin/sh

case "$1" in
    "packages")
    cd api
    npm i
    cd ../frontend
    npm i
    ;;
    "psql")
    psql hypertube < api/psql/db.sql
    ;;
    "run")
    cd api
    npm run dev
    ;;
    "api")
    cd api
    npm run server
    ;;
    "front")
    cd api
    npm run client
    ;;
    *)
    echo "Usage:"
    echo "sh deploy.sh packages - install npm packages for node js and react"
    echo "sh deploy.sh psql - deploy database"
    echo "sh deploy.sh run - run servers"
    echo "sh deploy.sh api - run api"
    echo "sh deploy.sh front - run front"
esac