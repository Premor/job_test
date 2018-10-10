const fs = require('fs');
// var pdf = require('html-pdf');
// var html = fs.readFileSync('./test.html', 'utf8');
// var options = { format: 'Letter' };
 
// pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
//   if (err) return console.log(err);
//   console.log(res); // { filename: '/app/businesscard.pdf' }
// });


const pug = require('pug');

// Compile the source code
const compiledFunction = pug.compileFile('template.pug');

// Render a set of data
fs.writeFileSync('./fakafakafaka',compiledFunction({
  name: 'Timothy'
}));
// "<p>Timothy's Pug source code!</p>"

// Render another set of data
console.log(compiledFunction({
  name: 'Forbes'
}));