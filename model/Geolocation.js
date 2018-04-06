
// const mongoose=require('mongoose');
// mongoose.Promise=global.Promise;    
// mongoose.connect('mongodb://localhost:27017/Geolocation');
// const db=require('./db-connect.js');
const {mongoose}= require('./db-connect.js');
var Geolocation=mongoose.model('locations',{
    location:{
        type:String,
        require:true,
        minlength:1,
        trim:true
    },
    lat:{
        type:Number
    },
    lan:{
        type:Number
    },
    state:{
        type:String,
    },
    country:{
        type:String,
    }
});

module.exports={
    Geolocation
}
