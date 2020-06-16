import React, { Component } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import ReactPlayer from 'react-player'
import {TextField, Button, createMuiTheme, MuiThemeProvider, IconButton} from '@material-ui/core';
import {v4 as uuid} from 'uuid'
import './Party.css'
import Infobar from '../Infobar/Infobar'
import InputComponent from '../InputComponent/InputComponent'
import Messages from '../Messages/Messages'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Redirect} from 'react-router-dom'
import InviteLink from '../InviteLink/InviteLink'
import { makeStyles } from '@material-ui/core/styles';
import Controls from '../Controls/Controls'
import EditAccess from '../Host specific controls/EditAccess/EditAccess'
const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });



export default class Party extends Component {

    constructor(props) {
        super(props);
        const {id} = queryString.parse(this.props.location.search);
        this.lastPlayBack = 0;
        this.interval = null;
        this.state = {
            error404: false,
            loaded: false,
            id :id,
            isHost: this.props.isHost || false,
            hostName: '',
            videoLink: '',
            userEditAccess: false,
            shouldPlay:true,
            nextVideoLink: '',
            videoLinkError: false,
            videoLinkHelperText: 'Please enter a valid video link',
            videoNum: 0,
            userName: '',
            userNameError: false,
            userNameHelperText: '',
            userNameExist: false,
            users: [],
            messages:[],
            message: '',
            hasControls: true
        }
        this.lastPausePlayBack = 0;
        
        this.vidPlayerRef = React.createRef();
        this.socket = null;
        this.startTime = new Date();
    }

    async componentDidMount() {
    //https://syncin-server.herokuapp.com
    //http://localhost:5000
        this.socket = io('http://localhost:5000');
        this.socket.emit('new connection', this.state.id, (value) => {
            if (!value) {
                this.setState({error404: true});
            }
        });
        this.socket.on('session details', (sessionDetails) => {
            this.setState({hostName: sessionDetails.hostName});
            this.setState({videoLink: sessionDetails.videoLink});
            this.setState({userEditAccess: sessionDetails.userEditAccess});
            this.setState({videoNum: sessionDetails.vidNum})
            this.setState({users: sessionDetails.users})
            this.setState({loaded: true});
            if (this.state.isHost) {
                this.setState({userName: sessionDetails.hostName});
                this.setState({userNameExist: true});
            }
            this.setState({hasControls: this.state.isHost || this.state.userEditAccess});
            this.lastPlayBack = sessionDetails.playBack;
        });

        this.socket.on('chat message', (message) => {
            let current_messages = this.state.messages;
            this.setState({messages: [...current_messages, message]});

        });

        this.socket.on('recieve message', (message) => {
            let current_messages = [...this.state.messages, message];
            this.setState({messages : current_messages});
        });

        this.socket.on('add video', (videoLinks) => {
            this.setState({videoLink: videoLinks});
        });

        this.socket.on('next video', () => { 
            this.lastPlayBack = 0;
            let num = this.state.videoNum;
            this.setState({videoNum: (num + 1)});
        });

        this.socket.on('prev video', () => { 
            this.lastPlayBack = 0;
            let num = this.state.videoNum;
            this.setState({videoNum: (num - 1)});
        });

        this.socket.on('onSeek Media', (timePassed) => {
            if (timePassed != null && this.state.userNameExist) {
                 this.vidPlayerRef.current.seekTo(timePassed, 'seconds')
            }
        });

        this.socket.on('play/pause', (playPause, timePassed) => {
            this.startTime = new Date();
            this.setState({shouldPlay:playPause})
            if (timePassed!=null && this.state.userNameExist) {
                this.vidPlayerRef.current.seekTo(timePassed, 'seconds')
            }
        });

        this.socket.on('add user', (users) => {
            this.setState({users : users});
        })
        this.socket.on('edit access', (value, playBack) => {
            this.setState({shouldPlay: true})
            this.setState({userEditAccess: value});
            this.setState({hasControls: this.state.isHost || this.state.userEditAccess});
            this.lastPlayBack = playBack;
            this.vidPlayerRef.current.seekTo(playBack, 'seconds');
        })
    }
    
    checkSeeked = () => {
        if (this.vidPlayerRef.current != null){
            if (this.vidPlayerRef.current.getCurrentTime() - this.lastPausePlayBack > 0.5) {
                this.seekMedia();
            }
        }
    }

    //If you want to play pass true if you want to pause pass false
    playPauseMedia = (playPause, timePassed) => {
        if ((this.props.isHost || this.state.userEditAccess) && (!playPause)) {
            this.lastPausePlayBack = timePassed;
            this.interval = setInterval(this.checkSeeked, 500);
        } else if ((this.props.isHost || this.state.userEditAccess) && (playPause) && this.interval != null) {
             clearInterval(this.interval);
        }       

        if ((this.props.isHost || this.state.userEditAccess) && (Math.round(((new Date()) - this.startTime) / 1000) > 1)) {
            this.setState({shouldPlay:playPause});
            this.socket.emit('play/pause media', this.state.id, playPause, timePassed);
        }
    
    }

    seekMedia = () => {
        let timePassed = this.vidPlayerRef.current.getCurrentTime();
           if (this.props.isHost || this.state.userEditAccess) {
               this.socket.emit('seek media', this.state.id, timePassed);
           }
    }

    addToQueue = () => {
        if (!ReactPlayer.canPlay(this.state.nextVideoLink)) {
            this.setState({videoLinkError: true});
            this.setState({videoLinkHelperText: 'Invalid Video Link'});
        }  else {
            this.setState({videoLinkError: false});
            this.setState({videoLinkHelperText: 'Please enter a valid video link'});
            let links = this.state.videoLink;
            links.push(this.state.nextVideoLink);
            this.setState({videoLink: links});
            this.setState({nextVideoLink: ''});                
            this.socket.emit('Add to queue', this.state.id, this.state.videoLink);
        }
    }
    //  playing={this.state.shouldPlay || false} onPlay={this.playPauseMedia(true)} onPause={this.playPauseMedia(false)}

    playNextVideo = () => {
        let num = this.state.videoNum;

        if (num < (this.state.videoLink.length - 1)) {
            this.lastPlayBack = 0;
            num = num + 1;
            this.setState({videoNum: (num)});
            this.socket.emit('playNext', this.state.id, num);
        }

    }

    playPreviousVideo = () => {
        let num = this.state.videoNum;

        if (num > 0) {
            this.lastPlayBack = 0;
            num = num - 1;
            this.setState({videoNum: (num)});
            this.socket.emit('playPrev', this.state.id, num);
        }
    }

    joinSession = () => {
        if (this.state.userName.trim() == '' || this.state.userName.toLowerCase().trim() == 'admin') {
            this.setState({userNameError: true});
            this.setState({userNameHelperText: 'Invalid Name'});
            console.log('error')
        } else {
            this.setState({userNameExist: true})
            let current_users = this.state.users;
            let userName = {
                [this.socket.id] : this.state.userName
            }
            current_users.push(userName);

            this.setState({users : current_users});
            this.socket.emit('new user', this.state.id, current_users, this.state.userName, function(playback) {
                this.lastPlayBack = playback;
            });

        }

        
    }
    componentWillUnmount() {
        let message= {user: 'admin', message: `${this.state.userName} has left the Party`}
            let current_messages = [...this.state.messages, message];
            this.setState({messages: current_messages});
            this.socket.emit('send message', this.state.id,this.state.userName, this.state.message);
            this.setState({message: ''});
    }

    sendMessage = (event) => {
        if (this.state.message) {
            let message= {user: 'current_user', message: this.state.message}
            let current_messages = [...this.state.messages, message];
            this.setState({messages: current_messages});
            this.socket.emit('send message', this.state.id,this.state.userName, this.state.message);
            this.setState({message: ''});
        }

    }

    setMessage = (event) => {
        this.setState({message: event.target.value})
    }

    setNextVideoLink = (event) => {
        this.setState({nextVideoLink: event.target.value});
    }

    beforeunload = (e) => {

          e.preventDefault();

    }

    vidLoaded = () => {
        this.vidPlayerRef.current.seekTo(this.lastPlayBack, 'seconds' )
    }

    //Functions which gives the user emit access
    // True gives it and False takes it
    giveUserEditAccess = (value) => {
        this.setState({userEditAccess: value});        
        this.setState({hasControls: this.state.isHost || this.state.userEditAccess});
        this.socket.emit('give user edit access',this.state.id ,value, this.vidPlayerRef.current.getCurrentTime());
    }

    render() {

        if (this.state.error404) {
            return (
                <Redirect to='/404' />

            )
        }


        if (!(this.state.isHost || this.state.userNameExist)) {
            return (
                <div className='nameform-wrapper'>
                    <div className="nameform">
                        <div className="userName">
                            <TextField inputProps={{ maxLength: 20 }} fullWidth={true} id="userName" label="Name" value={this.state.userName} onChange={(event) => this.setState({userName: event.target.value})} error={this.state.userNameError} helperText={this.state.userNameHelperText}/>
                        </div>
                        <div className="button">
                            <Button  variant="contained" color="primary"  onClick={this.joinSession}>
                                Continue
                            </Button>
                        </div>

                    </div>
                </div>
            )
        } else if (this.state.loaded) {
            return (
                <div className='container'>  
                    <div className="videoPlayer">
                        {(this.state.isHost || this.state.userEditAccess) && (
                            <ReactPlayer width='100%' height='100%' onReady={() => this.vidLoaded()} ref={this.vidPlayerRef} url={this.state.videoLink[this.state.videoNum]} controls={true} playing={this.state.shouldPlay} onPlay={() =>this.playPauseMedia(true, this.vidPlayerRef.current.getCurrentTime())} onPause={() => this.playPauseMedia(false,  this.vidPlayerRef.current.getCurrentTime())}
                            />
                        )}
                        {(!(this.state.isHost || this.state.userEditAccess)) && (
                            <ReactPlayer width='100%' height='100%' onReady={() => this.vidLoaded()} ref={this.vidPlayerRef} url={this.state.videoLink[this.state.videoNum]} controls={false} playing={this.state.shouldPlay} onPlay={() =>this.playPauseMedia(true, this.vidPlayerRef.current.getCurrentTime())} onPause={() => this.playPauseMedia(false,  this.vidPlayerRef.current.getCurrentTime())}
                            />
                        )}
                    </div>
                    <MuiThemeProvider theme={darkTheme}>

                    <div className="chat-container">
                        <Infobar hostName={this.state.hostName}/>
                        <Messages messages={this.state.messages}/>
                        <InputComponent message={this.state.message} setMessage={this.setMessage} sendMessage={this.sendMessage} />
                    </div>

                    <div className="controls-wrapper">
                    {(this.state.isHost || this.state.userEditAccess) && (
                        <Controls playPrevious={this.playPreviousVideo} playNext={this.playNextVideo} 
                        nextVidLink={this.state.nextVideoLink} setChangeVid={this.setNextVideoLink}
                        vidLinkError={this.state.videoLinkError} helperText={this.state.videoLinkHelperText}
                        addQueue={this.addToQueue} />
                    )}
                    </div>
                    <div className="invitebutton-wrapper">
                        <InviteLink />
                        {(this.state.isHost) && (
                            <EditAccess userHasEditAccess={this.state.userEditAccess} editAccessHandler={this.giveUserEditAccess}/>
                        )}
                    </div> 
                    </MuiThemeProvider>
             
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}
