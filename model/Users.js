const {mongoose}= require('./db-connect.js');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt = require("bcryptjs");




var UserSchema=new mongoose.Schema({
    name:{
        type:String
     },
     email:{
        type:String,
        require:true,
        minlength:6,
        unique: true,
        trim:true,
        validate:{
          validator:validator.isEmail,
          message:'{value} is not a valid email'
        }

    },
     password:{
         type:String,
         require:true
     },
     tokens:[{
         access:{
           type:String,
           require:true
         },
         token:{
           type:String,
           require:true
         }
     }]
})//stores all the properties 


UserSchema.methods.toJSON=function(){
    var user=this;
    var userObject=user.toObject();//responsible mongoose  variable user object and pick the properrties wwe need

    return _.pick(userObject,['_id','email']);
}

//now we can add instance methods below using schema
//no arrow function here
UserSchema.methods.generateAuthToken=function(){
   
    var user=this;//individual documents get called (bind)
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

    //updating tokens array above
   user.tokens= user.tokens.concat([{access,token}]);

   return user.save().then(()=>{
       return token
   });
   
}


UserSchema.statics.findByToken=function(token){
   var User=this; //model itself will bind here, not individual documents
   var docoded;

   try{
    decoded=jwt.verify(token,'abc123');
   }catch(e){
       return new Promise((resolve,reject)=>{
          reject();
       });

   }

   return User.findOne({
           '_id':decoded._id,
           'tokens.token':token,
           'tokens.access':'auth'
   })

}


UserSchema.statics.findByCredentials=function(email,password){
   
    var User=this;
    return User.findOne({email}).then((user)=>{
       if(!user){
          return Promise.reject();
       }
       
       return new Promise((resolve,reject)=>{
           bcrypt.compare(password,user.password,(err,res)=>{
               if(res==true){
                   resolve(user);
               }else{
                   reject();
               }
           })
       })
    })
};



UserSchema.pre('save',function(next){
   var user=this;
   if(user.isModified('password')){
       bcrypt.genSalt(10,(err,salt)=>{
           bcrypt.hash(user.password,salt,(err,hash)=>{
               user.password=hash;
               next();
           })
       });

   }else{
       next();
   }
});



var Users=mongoose.model('users',UserSchema);

module.exports={
    Users
}