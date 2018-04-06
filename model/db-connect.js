
const mongoose=require('mongoose');
mongoose.Promise=global.Promise;    
const REMOTE_MONGO = 'mongodb://sample:sample@ds129706.mlab.com:29706/sample';
//const LOCAL_MONGO = 'mongodb://localhost:27017/Geolocation';
const MONGO_URI = process.env.MONGODB_URI || REMOTE_MONGO;
mongoose.connect(MONGO_URI)
.then((res)=>{ console.log('connected')})
.catch((err)=>{ 
   console.log(err);
});

module.exports={
    mongoose
}