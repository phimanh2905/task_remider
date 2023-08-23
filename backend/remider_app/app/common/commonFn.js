const fs = require('fs');
const path = require('path');

function getDateNow(typeDate, charDate) {
  let dateNow = Date.now();

  let date_ob = new Date(dateNow);
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  switch (typeDate) {
    case "ddMMYYYY":
      return date + charDate + month + charDate + year;
    default: return month + charDate + date + charDate + year;
  }
}

function readFileWithPath(filePath, typeContent) {
  const filePathName = path.resolve(filePath);
  return fs.readFileSync(filePathName, typeContent ?? 'utf8');
}

function writeFileWithPath(filePath, contentFile, optionsWriteFile) {
  return fs.writeFileSync(path.resolve(filePath), contentFile, optionsWriteFile);
}

module.exports = {
  getDateNow,
  readFileWithPath,
  writeFileWithPath
}