const express = require('express');
const http = require('http');
const app = express();
const {SessionModel} = require('./MongoDB Models/SessionSchema');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

io.on('connect', (socket) => {
    console.log('New Connection');
    socket.on('New Session', (data) => {
        let session = new SessionModel({
            _id: data.id,
            videoLink: data.videoLink,
            hostName: data.hostName,
            userEditAccess: data.userEditAccess,
        })
        session.save((err) => {
            console.log(err)
        })

    });

    socket.on('new connection', (id) => {
        let video_session = null;
        SessionModel.findById(id, (err, session) => {
            if (err) throw err;
            if (session == null) {
                console.log(id);
                return
            }
            video_session = session;
            sessionDetails = {
                id : video_session._id,
                hostName: video_session.hostName,
                videoLink: video_session.videoLink,
                userEditAccess : video_session.userEditAccess

            }
            socket.join(video_session._id);
            io.in(video_session._id).emit('session details', sessionDetails);
        });
    })
    socket.on('play/pause media', (id, playPause, timePassed) => {
        socket.broadcast.to(id).emit('play/pause', playPause, timePassed);
    }) 

    socket.on('seek media', (id, timePassed) => {
        console.log('seekees')
        socket.broadcast.to(id).emit('onSeek Media', timePassed);
    }) 


    socket.on('disconnect', () => {
        console.log('Disconnected');

    })
});




server.listen(PORT, () => {
    console.log(`Server running on PORT - ${PORT}`);
});