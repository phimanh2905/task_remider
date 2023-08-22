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
  const filePath = `${path.dirname(fs.realpathSync(filePath))}/employees.json`;
}

module.exports = {
    getDateNow
}