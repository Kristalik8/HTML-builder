const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');


const templateFile = path.join(__dirname, 'template.html');

const indexFile = path.join(__dirname, 'project-dist', 'index.html');
const projectDistD = path.join(__dirname, 'project-dist');
const componentsD = path.join(__dirname, 'components');
const stylesD = path.join(__dirname, 'styles');
const styleFile = path.join(__dirname, 'project-dist', 'style.css');


fs.mkdir(projectDistD, {recursive: true}, (err) => {
  if (err) console.log(err);
});


function replace(template, objs) {
  for (const key in objs) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), objs[key]);
  }
  return template;
}


const styleFileOutput = fs.createWriteStream(styleFile);

try {
  (async function () {
    const componentsFiles = await fsProm.readdir(componentsD);

    let template = await fsProm.readFile(templateFile, 'utf8');
    const componentsOgj = {};
    componentsFiles.forEach((file) => {

      const key = path.parse(file).name;
      const componentPath = path.join(componentsD, file);

      fsProm.readFile(componentPath, 'utf8').then(content => {
        componentsOgj[key] = content;
        if (Object.keys(componentsOgj).length === componentsFiles.length) {
          const str = replace(template, componentsOgj);
          fsProm.writeFile(indexFile, str);
        }
      });
    });

    const stylesFiles = await fsProm.readdir(stylesD);
    stylesFiles.forEach(file => {
      const nameStylesFiles = path.join(stylesD, file);
      fs.stat(nameStylesFiles, (err, stats) => {
        if (stats.isFile() && (path.extname(file) === '.css')) {
          const readableStream = fs.createReadStream(nameStylesFiles);
          readableStream.on('data', chunk => styleFileOutput.write(chunk));
        }
      });
    });
  })();
  console.log('Merge произошёл! Ура! :) ');
} catch {
  console.log('Merge не произошёл :( ');
}


const assetsD = path.join(__dirname, 'assets');
const assetsCopyD = path.join(__dirname, 'project-dist', 'assets');

fs.mkdir(assetsCopyD, {recursive: true}, (err) => {
  if (err) console.log(err);
});


function copyDirRecur(dirD, dirCopyD) {

  if (dirCopyD.length !== 0) {
    fsProm.readdir(dirCopyD).then((files) => {
      files.forEach(file => {
        const dirCopyDFilePath = path.join(dirCopyD, file);
        fs.stat(dirCopyDFilePath, (err, stats) => {
          if (err) throw err;
          if (!stats.isDirectory()) {
            fs.unlink(dirCopyDFilePath, err => {
              if (err) throw err;
            });
          }
        });
      });
    });
  }

  fsProm.readdir(dirD).then(files => {
    files.forEach((file) => {

      let dirDPathFile = path.join(dirD, file);
      let dirCopyDPathFile = path.join(dirCopyD, file);

      fs.stat(dirDPathFile, (err, stats) => {
        if (err) throw err;
        if (stats.isDirectory()) {
          fs.mkdir(dirCopyDPathFile, {recursive: true}, (err) => {
            if (err) console.log(err);
          });
          copyDirRecur(dirDPathFile, dirCopyDPathFile);
        } else {
          fs.copyFile(dirDPathFile, dirCopyDPathFile, err => {
            if (err) throw err;
          });
        }
      });
    });
  });
}

copyDirRecur(assetsD, assetsCopyD);