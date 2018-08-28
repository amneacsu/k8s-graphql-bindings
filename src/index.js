import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { BrowserRouter as Router } from "react-router-dom";

import './index.css';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:3040/graphql',
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
, document.getElementById('root'));
