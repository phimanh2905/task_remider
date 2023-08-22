function getDateNow(){
    let dateNow = Date.now();

    let date_ob = new Date(dateNow);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    return date + "/" + month + "/" + year;
}

module.exports = {
    getDateNow
}