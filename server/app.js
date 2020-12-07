require('dotenv').config();

const express = require('express');
const consola = require('consola');
const bodyParser = require('body-parser');

const host = process.env.HOST;
const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());
const routes = require('./routes');
app.use('/', routes);

app.listen(port, () => {
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
})

