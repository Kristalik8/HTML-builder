const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');
const filesD = path.join(__dirname, 'files');
const filesCopyD = path.join(__dirname, 'files-copy');

fs.mkdir(filesCopyD, { recursive: true }, (err) => {
  if (err) console.log(err);
});


try {
  (async function () {
    const files = await fsProm.readdir(filesD);
    const filesCopy = await fsProm.readdir(filesCopyD);

    if (filesCopy.length !== 0) {
      filesCopy.forEach((fileCopy) => {
        fsProm.unlink(path.join(__dirname, 'files-copy', fileCopy));
      });
    }
    files.forEach(file => {
      fsProm.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    });
  })();
  console.log('Копирование произошло!');
} catch {
  console.log('Копирование не произошло');
}

