import React, { Component } from 'react';
import  {BrowserRouter as Router, Route} from 'react-router-dom';
import{Provider} from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utills/setAuthToken';
import {setCurrentUser} from './actions/authActions';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';



import './App.css';

//check for token
if(localStorage.jwtToken){
  //set aucthtoken header oauth
  setAuthToken(localStorage.jwtToken);
  //decodoing token
  const decoded=jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticvated
  store.dispatch(setCurrentUser(decoded)); 


}

class App extends Component {
  render() {
    return (
      <Provider store= {store}>
      <Router>
        <div className="App">
          <Navbar/>
          <Route exact path='/' component={Landing}/>
           <div className="container">
             <Route exact path='/register/new' component={Register} />
             <Route exact path='/login' component={Login} />
             <Route exact path='/dashboard' component={Dashboard}/>
           </div>
           <Footer/>

      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
