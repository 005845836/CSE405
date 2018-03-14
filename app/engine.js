const fs   = require('fs');
const path = require('path');

const templates = []; 

fs.readdir('./views', (err, filenames) => {
  filenames = filenames.filter(filename => filename.endsWith('.html'));
  filenames.forEach((filename) => {
    let pathname = path.join(process.cwd(), 'views', filename);
    templates[pathname] = fs.readFileSync(pathname, 'utf8');
  });
});

module.exports = function(pathname, options, cb) {
  let template = templates[pathname];
  if (template === undefined) cb(Error());
  const params = options.params;
  const keys   = Object.keys(params);
  keys.forEach((key) => {

    // checking if variable type is array
    if(Array.isArray(params[key])) {
      //if tag [table] is in the template, we generate table with given users data
      if (template.indexOf('[table]') !== -1){
        template = template.replace('[table]' + key + '[table]', generateTable(params[key]))
      }
    } else {
      template = template.replaceAll('#' + key + '#', params[key]);
    }
  });

  return cb(null, template);
};

// method that search all occurrences of a string in given string and replace that em all
String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function generateTable(params) {
  let html = '<table><tbody>';

  for(let i=0; i < params.length; i ++) {
    html += '<tr><td>' + (i+1)  + '</td>';
    // generate row of table with personal links(edit, delete) for each user
    html += '<td>' + params[i] + '</td>' +
      '<td><a href="/account/edit/' + params[i] + '">Edit</a></td>' +
      '<td><a href="/account/delete/' + params[i] +  '">Delete</a></td></tr>'
  }
  html += '</tbody></table>';
  return html;
}
