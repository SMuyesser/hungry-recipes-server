require('dotenv').config();
const axios = require('axios');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {API_KEY, PORT} = require('./config');

// Load API key from environment, loaded from .env in glitch.com
const GET_URL = 'http://food2fork.com/api/get';
const SEARCH_URL = 'http://food2fork.com/api/search';
const app = express();

app.use(morgan('dev'));
app.use(cors()); // allow Cross-Origin Resource Sharing globally

// https://food2fork-api-proxy.glitch.me/get?rId=5531
app.get("/get", (request, response) => {
  if (request.query.rId) {
    // add the API_KEY from the server side, no need to expose it on the client
    const query = {params: {key: API_KEY, rId: request.query.rId}};
    axios.get(GET_URL, query)
      .then(({data}) => response.json(data))
      .catch(error => response.status(500).json(error));
  } else {
    response.sendStatus(400);
  }
});

// https://food2fork-api-proxy.glitch.me/search?q=curry,chicken
app.get("/search", (request, response) => {
  const {q, sort, page} = request.query;
  if (q) {
    const query = {q, key: API_KEY};
    if (sort) { query.sort = sort; }
    if (page) { query.page = page; }
    axios.get(SEARCH_URL,{params: query})
      .then(({data}) => response.json(data))
      .catch(error => response.status(500).json(error))
  } else {
    response.sendStatus(400);
  }
});

// listen for requests :)
const listener = app.listen(
  PORT,
  () => console.log('Your app is listening on port ' + listener.address().port)
);