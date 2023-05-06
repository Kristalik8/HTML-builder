const fs = require('fs');
const path = require('path');
const textFile = path.join(__dirname, 'text.txt');
const {stdin, stdout} = process;

const textFileOutput = fs.createWriteStream(textFile, {  flags: 'a'});

stdin.on('data', data => {
  let text = data.toString().trim();
  if (text === 'exit') {
    process.exit();
  }
  textFileOutput.write(data);
});

process.on('SIGINT', () => {process.exit();});

process.on('exit', () => stdout.write('Поздравляю, вы создали файл!'));

stdout.write('\nНапишите что-нибудь\n');