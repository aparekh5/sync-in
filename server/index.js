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
const cors = require('cors')
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false);


 
app.use(cors());


io.on('connect', (socket) => {
    console.log('New Connection');
    socket.on('New Session', (data) => {
        let session = new SessionModel({
            _id: data.id,
            videoLink: data.videoLink,
            hostName: data.hostName,
            userEditAccess: data.userEditAccess,
            vidNum: 0,
            users: [data.hostName],
            lastPlayBack: 0
        })
        session.save((err) => {
            console.log(err)
        })

    });

    socket.on('new user', (id, userList, userName, fn) => {
        SessionModel.findOneAndUpdate({_id: id}, {users: userList}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });

        SessionModel.findById(id, (err, session) => {
            if (err) throw err;
            video_session = session;
            fn(video_session.lastPlayBack)
        })
        

        socket.emit('chat message', {user: 'admin', message: `${userName}, Welcome to the Room`})
        socket.broadcast.to(id).emit('chat message', {user: 'admin', message: `${userName} has Joined`})

    });

    socket.on('send message', (id, user, message) => {
        socket.broadcast.to(id).emit('recieve message', {user : user, message: message});
    });
/**/ 

    socket.on('new connection', (id, confirmation) => {
        let video_session = null;
        SessionModel.findById(id, (err, session) => {
            if (err) throw err;
            if (session == null) {
                confirmation(false);
                return
            }
            video_session = session;
            sessionDetails = {
                id : video_session._id,
                hostName: video_session.hostName,
                videoLink: video_session.videoLink,
                userEditAccess : video_session.userEditAccess,
                vidNum : video_session.vidNum,
                users: video_session.users, 
                playBack: video_session.lastPlayBack
            }
            console.log(sessionDetails.hostName + ' hosss');

            socket.join(video_session._id);
            io.in(video_session._id).emit('session details', sessionDetails);
        });
    })
    socket.on('play/pause media', (id, playPause, timePassed) => {

        SessionModel.findOneAndUpdate({_id: id}, {lastPlayBack: timePassed}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });

        socket.broadcast.to(id).emit('play/pause', playPause, timePassed);
    }) 

    socket.on('seek media', (id, timePassed) => {
        SessionModel.findOneAndUpdate({_id: id}, {lastPlayBack: timePassed}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });
        socket.broadcast.to(id).emit('onSeek Media', timePassed);
    }) 

    socket.on('Add to queue', (id, videoLinks) => {

        SessionModel.findOneAndUpdate({_id: id}, {videoLink: videoLinks}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });
        socket.broadcast.to(id).emit('add video', videoLinks);
    });

    socket.on('playPrev', (id, videoNum) => {

        SessionModel.findOneAndUpdate({_id: id}, {vidNum: videoNum}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });
        SessionModel.findOneAndUpdate({_id: id}, {lastPlayBack: 0}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });
        socket.broadcast.to(id).emit('prev video', videoNum);
    });
    
    socket.on('playNext', (id, videoNum) => {

        SessionModel.findOneAndUpdate({_id: id}, {vidNum: videoNum}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });
        SessionModel.findOneAndUpdate({_id: id}, {lastPlayBack: 0}, {
            new: true
        }, 
        (err) => {
            if (err) throw err
        });

        socket.broadcast.to(id).emit('next video', videoNum);
    });



    socket.on('disconnect', (id, users) => {
        console.log('Disconnected')
    })
});




server.listen(PORT, () => {
    console.log(`Server running on PORT - ${PORT}`);
});

