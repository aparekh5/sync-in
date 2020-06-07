import React, { Component } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import ReactPlayer from 'react-player'

export default class Party extends Component {

    constructor(props) {
        super(props);
        const {id} = queryString.parse(this.props.location.search);
        this.state = {
            loaded: false,
            id :id,
            hostName: '',
            videoLink: '',
            userEditAccess: false,
            shouldPlay:true
        }
        this.vidPlayerRef = React.createRef();
        this.socket = null;
        this.startTime = new Date();
    }

    async componentDidMount() {
        this.socket = io('http://localhost:5000');
        this.socket.emit('new connection', this.state.id);
        this.socket.on('session details', (sessionDetails) => {
            this.setState({hostName: sessionDetails.hostName});
            this.setState({videoLink: sessionDetails.videoLink});
            this.setState({userEditAccess: sessionDetails.userEditAccess});
            this.setState({loaded: true});
            console.log('done');
            console.log(this.props.isHost)
        });
    
    }
    

    //If you want to play pass true if you want to pause pass false
    playPauseMedia = (playPause, timePassed) => {
            console.log('emit');
        if ((this.props.isHost || this.state.userEditAccess) && (Math.round(((new Date()) - this.startTime) / 1000) > 1)) {
            this.setState({shouldPlay:playPause});
            this.socket.emit('play/pause media', this.state.id, playPause, timePassed);
        }
        
        this.socket.on('play/pause', (playPause, timePassed) => {
            this.startTime = new Date();
            this.setState({shouldPlay:playPause})
            console.log('recieved');
            if (timePassed!=null) {
                this.vidPlayerRef.current.seekTo(timePassed, 'seconds')
            }
        });
       

    }

    seekMedia = () => {
        let timePassed = this.vidPlayerRef.current.getCurrentTime();
        console.log('media seeked');
           if (this.props.isHost || this.state.userEditAccess) {
               this.socket.emit('seek media', this.state.id, timePassed);
               console.log('sent')
           }

           this.socket.on('onSeek Media', (timePassed) => {
               if (timePassed != null) {
                    this.vidPlayerRef.current.seekTo(timePassed, 'seconds')
               }
           });
    }
    //  playing={this.state.shouldPlay || false} onPlay={this.playPauseMedia(true)} onPause={this.playPauseMedia(false)}

    render() {
        if (this.state.loaded) {
            return (
                <div>  
                    <p>{this.props.isHost}</p>
                    <br/>
                    <ReactPlayer onSeek={this.seekMedia} ref={this.vidPlayerRef} url={this.state.videoLink[0]} controls={this.props.isHost || this.state.userEditAccess} playing={this.state.shouldPlay} onPlay={() =>this.playPauseMedia(true, this.vidPlayerRef.current.getCurrentTime())} onPause={() => this.playPauseMedia(false,  this.vidPlayerRef.current.getCurrentTime())} />

                </div>
            )
        } else {
            return (
                <div>  
                </div>
            )
        }
    }
}
