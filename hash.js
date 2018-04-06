const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');

var data={
    id:10
}
var token=jwt.sign(data,'123ABC');
console.log(token);
var decoded=jwt.verify(token,'123ABC');
console.log(decoded);