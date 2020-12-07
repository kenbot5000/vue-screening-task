# vue-screening-task

## Prerequisites
A MongoDB installation.

## Project setup
```
nps install_client
nps install_server
```

### Compiles and hot-reloads for development
Start API server
```
nps start
```
Start Vue project
```
nps serve
```

## How to fill up the database
Provided that the all the dependencies and MongoDB are installed, just click on the "Repopulate Items" button and it will fill automatically. Alternatively, run a POST request to http://localhost:5000/populate and it will also fill the database with the default values.