import React, { Component } from 'react';
import { Route } from "react-router-dom";

import Dashboard from './pages/Dashboard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Dashboard} />
      </div>
    );
  }
}

export default App;
