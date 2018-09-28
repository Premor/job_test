const FS = require('fs');


FS.readFile('./get_money.sql',(err,val)=>{if (!err){module.exports.get_money = val.toString()}else{console.log('SQL module',err)}})