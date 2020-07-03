const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Session = new Schema({
    _id : {type: String},
    videoLink: { type: Array},
    hostName: { type: String, required:true},
    userEditAccess: { type: Boolean, default:false},
    vidNum : {type: Number, default: 0},
    users : {type: Array},
    lastPlayBack : {type: Number, default: 0},
    usersInCall : {type: Array, default: []}
});

const SessionModel = mongoose.model('Sessions', Session);

module.exports= {SessionModel};   