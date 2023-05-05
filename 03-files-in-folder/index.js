const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fsProm.readdir(folder).then(files => {
  for (let i= 0; i<files.length; i+=1) {
    let file = files[i];
    fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
      if (err) throw err;
      if (stats.isFile() === true) {
        const fileName = path.parse(file).name;
        const fileSize = stats.size;
        let fileExt = path.extname(file).slice(1);
        if(fileExt.length === 0) fileExt = 'without extension';
        console.log(`${fileName} - ${fileExt} - ${fileSize / 1000}kb`);
      }
    });
  }
}).catch(err => {
  console.log(err);
});


