const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser").json();
const port = process.env.port || 3000;
const { Geolocation } = require("./model/Geolocation");
const { Users } = require("./model/Users");
const bcrypt = require("bcryptjs");
const { authenticate } = require("./middleware/authenticate");

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});



app.get('/users/me',authenticate,(req,res)=>{

  res.send(req.user);
  
  // var token=req.header('x-auth');
  // Users.findByToken(token).then((user)=>{
  //      if(!user){
  //        return Promise.reject();
  //      }
  //      res.send(user);
  // }).catch((e)=>{
  //   res.status(401).send();
  // });


})

// app.delete('/users/me/token',authenticate,(req,res)=>{
//   req.user.removeToken(req.token);
// })




app.post("/geolocation/add", bodyParser, (req, res) => {
  var body = _.pick(req.body, ["location", "lat", "lng", "state", "country"]);
  var geolocation = new Geolocation(body);
  geolocation
    .save()
    .then(resp => {
      res.status(201).send(resp);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});





// app.post("/users/register", bodyParser, (req, res) => {

//   var body = _.pick(req.body, ["name", "email", "password"]);

//   bcrypt.hash(body.password, bcrypt.genSaltSync(10), (err, hash) => {
//     body.password = hash;
//     // Store hash password in DB
//     var user = new Users(body);
//     user
//       .save()
//       .then(() => {

//         return user.generateAuthToken();
//        // res.status(201).send();
      
      
//       })
//       .then((token)=>{
//            res.header('x-auth',token).send(user);
//       })
//       .catch(err => {
//         res.status(400).send(err);
//       });
//   });
// });


app.post("/users/register", bodyParser, (req, res) => {

  var body = _.pick(req.body, ["name", "email", "password"]);
   
  var user = new Users(body);
    user
      .save()
      .then(() => {

        return user.generateAuthToken();
       // res.status(201).send();
      
      
      })
      .then((token)=>{
           res.header('x-auth',token).send(user);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  
});






app.post("/users/login", bodyParser, (req, res) => {

  var body = _.pick(req.body, ["email", "password"]);
  Users.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
  }).catch((e)=>{
    res.status(400).send();
  });

  // Users.findOne({ email: body.email }).then(user => {
  //   bcrypt
  //     .compare(body.password, user.password, function(err, result) {
  //       let userDetails={
  //         name:user.name,
  //         email:user.email
  //       }
  //       if (result === true) {
  //         res.status(201).send(userDetails);
  //       } else {
  //         res.status(401).send();
  //       }
  //     })
  //     .catch(() => {
  //       res.status(401).send();
  //     });
  // });

  
});


// app.post("/users/login", bodyParser, (req, res) => {

//   var body = _.pick(req.body, ["email", "password"]);
//   Users.findByCredentials(body.email,body.password).then((user)=>{

//   });

//   Users.findOne({ email: body.email }).then(user => {
//     bcrypt
//       .compare(body.password, user.password, function(err, result) {
//         let userDetails={
//           name:user.name,
//           email:user.email
//         }
//         if (result === true) {
//           res.status(201).send(userDetails);
//         } else {
//           res.status(401).send();
//         }
//       })
//       .catch(() => {
//         res.status(401).send();
//       });
//   });

  
// });





app.get(
  "/geolocation/lists",
  (req, res, next) => {
    Geolocation.find({}).then(locations => {
      res.send({
        locations
      });
    });
  },
  err => {
    console.log("unable to get" + err);
  }
);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
