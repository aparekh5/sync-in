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
import {IconButton} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
class App extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      host: false,
      buttonStyle: {}
    }
    this.setHostTrue = this.setHostTrue.bind(this);

  }

  setHostTrue (val) {
    this.setState({host:val});
  }

  closeStyle = () => {
    this.setState({buttonStyle: {
      display: 'none'
    }})
  };


  render () {
    return (
        <Router>
            <Navbar />
            <div className="blank-div" style={{backgroundColor: 'black', height: '5vh', width: '100%'}}>            </div>
            <div className="pop-up-bar" style={this.state.buttonStyle}>
              <div className="support-text">
                <a href='https://www.paypal.me/parekharyaman' target='_blank'>Support Us via PayPal</a>
                
              </div>
              <div className="closeButtonThem">
              <IconButton onClick={this.closeStyle} style={this.state.buttonStyle}>
                <CancelIcon />
              </IconButton>
              </div>
            </div>
            <Switch>
              <Route path='/' exact
                component={HomePage}/>
              <Route path="/host" exact 
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