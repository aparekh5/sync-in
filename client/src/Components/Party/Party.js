import React, { Component, useRef, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import ReactPlayer from 'react-player'
import {TextField, Button, createMuiTheme, MuiThemeProvider, IconButton, Icon, Tooltip} from '@material-ui/core';
import './Party.css'
import Infobar from '../Infobar/Infobar'
import InputComponent from '../InputComponent/InputComponent'
import Messages from '../Messages/Messages'
import {Redirect} from 'react-router-dom'
import InviteLink from '../InviteLink/InviteLink'
import Controls from '../Controls/Controls'
import Zoom from '@material-ui/core/Zoom';
import MicIcon from '@material-ui/icons/Mic';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import MicOffIcon from '@material-ui/icons/MicOff';
import Peer from 'simple-peer'


import EditAccess from '../Host specific controls/EditAccess/EditAccess'
import { createRef } from 'react';

const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });



  const CustomAudio = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <audio playsInline muted={!props.deafened}  ref={ref} autoPlay/>
    );
}


export default class Party extends Component {

    constructor(props) {
        super(props);
        this.stream = null;
        const {id} = queryString.parse(this.props.location.search);
        this.lastPlayBack = 0;
        this.interval = null;
        this.haveUsers = false;
        this.muteMicComp = <Tooltip TransitionComponent={Zoom} title='Mute'><IconButton color="primary" aria-label="Muted" onClick={this.onClickMute} component="span"><MicOffIcon color='secondary' fontSize='large'/></IconButton></Tooltip>;
        this.unmuteMicComp = <Tooltip TransitionComponent={Zoom} title='Unmute'><IconButton color="primary" aria-label="Muted" onClick={this.onClickMute} component="span"><MicIcon color='secondary' fontSize='large'/></IconButton></Tooltip>;
        this.deafenComp =  <Tooltip TransitionComponent={Zoom} title='Deafen'><IconButton color="primary" onClick={this.onClickDeafen} aria-label="Mute" component="span"><VolumeOffIcon color='secondary' fontSize='large'/></IconButton></Tooltip>;
        this.undeafenComp =  <Tooltip TransitionComponent={Zoom} title='Undeafen'><IconButton onClick={this.onClickDeafen} color="primary" aria-label="Mute" component="span"><VolumeUpIcon color='secondary' fontSize='large'/></IconButton></Tooltip>;
        this.leaveCallCalled = false;
        this.joinCallAudio = createRef();
        this.leaveCallAudio = createRef();

        this.state = {
            stream: null,
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
            hasControls: true,
            deafened: true,
            muted: false,
            muteComponent: this.muteMicComp,
            volumeComponent: this.deafenComp,
            inCall: false,
            callText: 'Join Call',
            peersRefs: []
        }
        this.lastPausePlayBack = 0;
        this.vidPlayerRef = React.createRef();
        this.socket = null;
        this.startTime = new Date();
        this.peersRefs = [];
    }

    async componentDidMount() {
    //https://syncin-server.herokuapp.com
    //http://localhost:5000
        this.socket = io('https://syncin-server.herokuapp.com');
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


    onClickDeafen = () => {
        if (this.state.inCall) {
            let deafened = this.state.deafened;
            deafened = !deafened;
            if (!deafened) {
                this.setState({volumeComponent:  this.undeafenComp})
            } else {
                this.setState({volumeComponent: this.deafenComp})
            }
            this.setState({deafened: deafened});
        }   
    }

    onClickMute = () => {
        if (this.state.inCall) {
            let muted = this.state.muted;

            muted = !muted;
            if (muted) {
                this.setState({muteComponent:  this.unmuteMicComp})
                this.stream.getAudioTracks()[0].enabled = false;
            } else {
                this.setState({muteComponent:  this.muteMicComp})
                this.stream.getAudioTracks()[0].enabled = true;

            }
            this.setState({muted: muted});
        }
        
    }

    joinLeaveOnClickListener = () => {
        let inCall = !this.state.inCall;
        this.setState({inCall: inCall});
        if (inCall) {
            this.setState({callText: 'Leave Call'})
            this.joinCall();
        } else {
            this.setState({callText: 'Join Call'})
            this.leaveCall();
        }
    }




    createPeer = (userToSignal, callerId, stream) => {
        console.log('create peer called', userToSignal);
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on('signal', signal => {
            console.log('sending a signal to server')
            this.socket.emit('sending signal', {
                'userToSignal': userToSignal,
                'callerId': callerId,
                'signal': signal
            });
        });
        

        return peer;
    }

    addPeer = (incomingSignal, callerId, stream) => {
        console.log('Add peer called', callerId);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });
        
        peer.signal(JSON.stringify(incomingSignal));

        peer.on('signal', signal =>{
            console.log('returning a signal to : ', callerId)
            this.socket.emit('returning signal', {
                'signal': signal,
                'callerId': callerId
            });
        });

        return peer;
    }

    joinCall = () => {
        if (!this.leaveCallCalled) {
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
                this.setState({inCall: true});
                this.stream = stream;
                console.log(this.socket.id);
                this.socket.emit('join call', this.state.id, this.state.userName);
                console.log(this.state.peersRefs);
                this.socket.on('all users', (usersInThisRoom) => {
                    if (!this.haveUsers) {
                        this.haveUsers = true;
                        console.log('recieved all users')
                        console.log('all users ', usersInThisRoom);
                        const peers = [];
                        usersInThisRoom.forEach(user => {
                            console.log('for each called')
                            const peer = this.createPeer(user['id'], this.socket.id, stream);
                            peers.push({
                                'peerId' : user['id'],
                                'peer': peer 
                            })
                        });
                        this.peersRefs = peers;
                        this.setState({peersRefs : this.peersRefs});
                    }
                });

                this.socket.on('user joined', payload => {
                    
                    this.joinCallAudio.current.play = true;
                    const audioElement = document.getElementsByClassName("audio-join-sound")[0]
                    console.log('new user has joined', payload['callerId']);
                    const peer = this.addPeer(payload['signal'], payload['callerId'], stream);
                    this.peersRefs.push({
                        'peerId': payload['callerId'],
                        'peer': peer
                    })
                    this.setState({'peersRefs': this.peersRefs});
                });
    
                this.socket.on('receiving returned signal', payload => {
                    console.log('returned signal recieved ', payload.id)
                    const peerToSignal = this.peersRefs.find(peer => peer['peerId'] === payload.id)
                    peerToSignal['peer'].signal(JSON.stringify(payload.signal));
                });

                this.socket.on('remove user', (id) => {
                    this.leaveCallAudio.current.play = true;

                    this.peerToDestroy = this.peersRefs.find((peer) => {
                        return peer['peerId'] === id; 
                    })
                    this.peerToDestroy.peer.destroy();
                    let peersList = this.peersRefs.filter((peer) => {
                        return peer['peerId'] !== id;
                    });
                    this.peersRefs = peersList;
                    this.setState({peersRefs:peersList});
                    console.log('new List', this.state.peersRefs);
                    console.log(this.peersRefs);
                })

            });
        } else {
            this.stream.getAudioTracks()[0].enabled = true;
            this.setState({deafened: true});

        }
    }

    leaveCall = () => {
        this.stream.getAudioTracks()[0].enabled = false;
        this.setState({deafened: false});
        this.leaveCallCalled = true;
        
        /*
        this.haveUsers = false;
        this.stream.getTracks().forEach(function(track) {
            track.stop();
          });
        let usersToSignal = this.peersRefs.filter(peer => {
            return (peer['peerId'] !== this.socket.id);
        });
        this.socket.emit('leaving call room', this.state.id, this.socket.id, usersToSignal);
        for (let i = 0; i < this.state.peersRefs.length; i++) {
            this.peersRefs[i]['peer'].destroy();
        }
        this.peersRefs = []
        this.setState({'peersRefs' : []});
        */
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
                        <div className="audio">
                            {
                                this.state.peersRefs.map((peer, index) => {
                                    return (
                                        <CustomAudio key={index} deafened={this.state.deafened} peer={peer.peer} />
                                    )
                                })
                            }
                        </div>

                        <div className="audio-icons">
                            <div className='audio-btn-wrapper'>
                                <Button className='audio-btn' onClick={this.joinLeaveOnClickListener} color='secondary' style={{fontSize: '18px'}}>{this.state.callText}</Button>
                            </div>
                            <div className="audio-icon-wrapper">
                                {this.state.muteComponent}
                                {this.state.volumeComponent}
                            </div>
                        </div>

                        <Infobar hostName={this.state.hostName}/>
                        <Messages messages={this.state.messages}/>
                        <InputComponent message={this.state.message} setMessage={this.setMessage} sendMessage={this.sendMessage} />
                    </div>

                    <div className="controls-wrapper">
                        <Controls playPrevious={this.playPreviousVideo} disabled={(this.state.isHost || this.state.userEditAccess)} playNext={this.playNextVideo} 
                        nextVidLink={this.state.nextVideoLink} setChangeVid={this.setNextVideoLink}
                        vidLinkError={this.state.videoLinkError} helperText={this.state.videoLinkHelperText}
                        addQueue={this.addToQueue} />
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

