const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Session = new Schema({
    _id : {type: String},
    videoLink: { type: Array,},
    hostName: { type: String, required:true},
    userEditAccess: { type: Boolean, default:false},
});

const SessionModel = mongoose.model('Sessions', Session);

module.exports= {SessionModel};   