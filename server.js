const http = require('http')
const fs = require('fs')
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
      console.log(file)
      var pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
          travel(pathname, callback);
      } else {
          callback(pathname);
      }
  });
}

travel();

