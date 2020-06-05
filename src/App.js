import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom';

import './App.css';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="nav">
          <div className="mr-3">
            <Link to="/">Chart</Link>
          </div>
          <div className="mr-3">
            <Link to="/history">Historical data</Link>
          </div>
        </div>
        <div className="App-header">
          <Home />
        </div>
      </div>
    </Router>
  );
}

export default App;
