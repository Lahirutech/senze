import React, { Component } from 'react';
import  {BrowserRouter as Router, Route} from 'react-router-dom';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';


import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar/>
          <Route exact path='/' Component={Landing}/>
            <Footer/>

      </div>
      </Router>
    );
  }
}

export default App;
