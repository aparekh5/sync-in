import React, { Component, useEffect } from 'react';
import './Host.css'
import ReactPlayer from 'react-player';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import path from 'path';
import { TextField } from '@material-ui/core';

const  {SessionModel} = require('../../MongoDB Models/SessionSchema')


class Host extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id: uuidv4(),
            videoLink: '',
            hostName: '',
            userHostAccess: true,
            userNameError: false,
            videoLinkError: false
        };
        this.startSession = this.startSession.bind(this);
        this.socket = null;
    }
   

    startSession(event) {
        if (!ReactPlayer.canPlay(this.state.videoLink)) {
            event.preventDefault();
            this.setState({videoLinkError: true});
        }
        if (this.state.hostName.trim == '') {
            event.preventDefault();
            this.setState({userNameError: true});
            return;
        } else if (ReactPlayer.canPlay(this.state.videoLink)) {
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
            <div>
                <div className="inputLink">
                    <br/>
                    Please Enter the link for the Video You want to watch -  
                    <TextField id="videoLink" label="Video Link" value={this.state.videoLink} onChange={(event) => this.setState({videoLink: event.target.value})} error={this.state.videoLinkError} helperText='Invalid Video Link'/>

                    <br/>
                    <br/>
                    <TextField id="userName" label="Name" value={this.state.hostName} onChange={(event) => this.setState({hostName: event.target.value})} error={this.state.userNameError}/>
                    <br/>
                    <br/>
                    <input type="checkbox" name="userControl" id="" checked={this.state.userHostAccess} onChange={(event) => this.setState({userHostAccess: event.target.checked})}/>
                    Only allow host to control video
                    <br/>
                    <br/>
                    <Link to={`/party/?id=${this.state.id}`} type="submit" onClick={this.startSession} id="linkTag"> Host </Link>
                </div>
            </div>
        );
    }
}



export default Host;
