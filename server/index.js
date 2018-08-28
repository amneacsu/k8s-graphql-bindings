const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const K8s = require('k8s');
const axios = require('axios');

require('dotenv').config();

const kubectl = K8s.kubectl({
  namespace: 'staging',
  binary: '/usr/local/bin/kubectl',
});

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `bearer ${process.env.GITHUB_KEY}`,
  },
});

github.interceptors.response.use(null, (error) => {
  // console.log(error);

  return Promise.reject(new Error("asd"));
});

const schema = require('./schema');
const app2 = express();

app2.use(cors(), graphqlHTTP({
  schema,
  context: { kubectl, github },
}));

app2.listen(3040);
