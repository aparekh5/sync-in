import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Host from '../Host/Host'
import Party from '../Party/Party'
import io from 'socket.io-client';
import Navbar from '../Navbar/Navbar'
import PageNotFound from '../PageNotfound/PageNotFound'
import HomePage from '../HomePage/HomePage'
import reportBug from '../reportBug/reportBug';
class App extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      host: false
    }
    this.setHostTrue = this.setHostTrue.bind(this);
  }

  setHostTrue (val) {
    this.setState({host:val});
  }



  render () {
    return (
        <Router>
            <Navbar />
            <Switch>
            <Route path="/" exact 
            render={() => <Host setHostTrue={this.setHostTrue}/>}/>
            <Route path='/bug' exact component ={reportBug} />
            <Route path="/party" 
            render={(props) =>  <Party {...props} prop isHost={this.state.host}/>}/>
            <Route path='*' component={PageNotFound}/>
          </Switch>
        </Router>
    );
  }
}

export default App;