const FS = require('fs');


FS.readFile('./get_money.sql',(err,val)=>{if (!err){module.exports.get_money = val.toString()}else{console.log('SQL module',err)}})

FS.readFile('./get_money.sql',(err,val)=>{if (!err){module.exports.update_history = val.toString()}else{console.log('SQL module',err)}})