import React, { Component, useEffect } from 'react';
import './Host.css'
import ReactPlayer from 'react-player';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import path from 'path';
import { TextField, Checkbox, FormControlLabel, Button, MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const lightTheme = createMuiTheme({
    palette: {
      type: 'dark',
    }
  });

class Host extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id: uuidv4(),
            videoLink: '',
            hostName: '',
            userHostAccess: true,
            userNameError: false,
            userNameHelperText: '',
            videoLinkError: false,
            videoLinkHelperText: 'Please enter a valid video link'
        };
        this.startSession = this.startSession.bind(this);
        this.socket = null;
    }
   

    startSession(event) {
        if (!ReactPlayer.canPlay(this.state.videoLink)) {
            event.preventDefault();
            this.setState({videoLinkError: true});
            this.setState({videoLinkHelperText: 'Invalid Video Link'});

        } else {
            this.setState({videoLinkError: false});
            this.setState({videoLinkHelperText: 'Please enter a valid video link'});
        }
        if (this.state.hostName.trim() == '') {
            event.preventDefault();
            this.setState({userNameError: true});
            this.setState({userNameHelperText: 'Invalid Name'});

            return;
        } else {

            this.setState({userNameError: false});
            this.setState({userNameHelperText: ''});
        }
        
        if (ReactPlayer.canPlay(this.state.videoLink) && this.state.hostName.trim() != '') {
            let data = {
                id: this.state.id,
                videoLink: this.state.videoLink,
                hostName: this.state.hostName,
                userEditAccess: !this.state.userHostAccess,
            };
            this.props.setHostTrue(true);
            this.socket.emit('New Session', data);
        }
    }


    
    componentWillMount() {
        this.socket = io('http://localhost:5000')
    }



    render() {
        return (
                <div className='form'>
                    <div className="inputForm">
                    <MuiThemeProvider theme={lightTheme}>

                        <div className="videoLink">
                        <TextField color='secondary' fullWidth={true} id="videoLink" label="Video Link" value={this.state.videoLink} onChange={(event) => this.setState({videoLink: event.target.value})} error={this.state.videoLinkError} helperText={this.state.videoLinkHelperText} />
                        </div>
                        <div className="userName">
                        <TextField  color='secondary' fullWidth={true} inputProps={{ maxLength: 20 }} id="userName" label="Name" value={this.state.hostName} onChange={(event) => this.setState({hostName: event.target.value})} error={this.state.userNameError} helperText={this.state.userNameHelperText}/>
                        </div>
                        <div className="check">
                        <FormControlLabel 
                            className='checkbox-label'
                            value="end"
                            control={                    
                            <Checkbox   checked={this.state.userHostAccess} onChange={(event) => this.setState({userHostAccess: event.target.checked})}
                            color='secondary'
                            />
                            }
                            label='Only Allow Host to Control Video'
                            labelPlacement='end'
                        />
                        </div>
                        <div className="button">
                        <Button variant="contained" color="secondary" component={Link} to={`/party/?id=${this.state.id}`} onClick={this.startSession}>
                            Start Meeting
                        </Button>
                        </div>

                        </MuiThemeProvider>

                    </div>
                </div>
        );
    }
}



export default Host;
