const random = require('random');

class Utils {
  randHex(len) {
    let maxlen = 8;
    let min = Math.pow(16,Math.min(len,maxlen)-1);
    let max = Math.pow(16,Math.min(len,maxlen)) - 1;
    let n = Math.floor( random.float() * (max-min+1) ) + min;
    let r = n.toString(16);
    while (r.length < len) {
      r = r + randHex( len - maxlen );
    }
    return r;
  }

  getDateString(date) {
    let dateString = '';
    dateString += date.getFullYear() + '-';
    if (date.getMonth()+1 >= 10) {
      dateString += (date.getMonth()+1);
    }
    else {
      dateString += ('0' + (date.getMonth()+1));
    }
    dateString += '-';
    if (date.getDate() >= 10) {
      dateString += date.getDate();
    }
    else {
      dateString += ('0' + date.getDate());
    }
    return dateString;
  }
}

let utils = new Utils();
module.exports = utils;