const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');
const stylesD = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');


const bundleFileOutput = fs.createWriteStream(bundleFile);


try {
  (async function () {
    const stylesFiles = await fsProm.readdir(stylesD);
    stylesFiles.forEach(file => {
      const nameStylesFiles = path.join(stylesD, file);
      fs.stat(nameStylesFiles, (err, stats) => {
        if (stats.isFile() && (path.extname(file) === '.css')) {
          const readableStream = fs.createReadStream(nameStylesFiles);
          readableStream.on('data', chunk => bundleFileOutput.write(chunk));
        }
      });
    });
  })();
  console.log('Merge styles произошёл!');
} catch {
  console.log('Merge styles не произошёл :( ');
}