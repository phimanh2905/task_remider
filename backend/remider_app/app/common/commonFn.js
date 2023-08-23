function getDateNow(){
    let dateNow = Date.now();

    let date_ob = new Date(dateNow);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    return date + "/" + month + "/" + year;
}

function readFileWithPath(filePath, typeContent){
  const fs = require('fs');
  const path = require('path');
  const filePathName = path.resolve(filePath);
  return fs.readFileSync(filePathName, typeContent ?? 'utf8');
}

module.exports = {
    getDateNow,
    readFileWithPath
}