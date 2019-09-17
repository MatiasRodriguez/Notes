const moongose = require('mongoose');
const {Schema}=moongose;

const NoteSChema = new  Schema({
    title: {type : String , required : true},
    description : {type : String , required : true},
    date:{ type : Date , default : Date.now}
});

module.exports = moongose.model('Note',NoteSChema);