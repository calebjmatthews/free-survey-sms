const random = require('random');

class Utils {
  randHex(len) {
    let maxlen = 8;
    let min = Math.pow(16,Math.min(len,maxlen)-1);
    let max = Math.pow(16,Math.min(len,maxlen)) - 1;
    let n = Math.floor( random.float() * (max-min+1) ) + min;
    let r = n.toString(16);
    while (r.length < len) {
      r = r + this.randHex( len - maxlen );
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

  // Take in a string of various format and output an internationally formatted string
  phoneNumberIn(rawNum) {
    if (!rawNum) { return null; }
    if (rawNum.slice(0,1) == '+') {
      return rawNum;
    }
    // ex: John Doe (303) 555-5309 -> 3035555309
    let formatNum = new String(rawNum).replace(/\D/g,'');
    // ex: 3035555309 -> +13035555309
    if (formatNum.length == 10) {
      return '+1' + formatNum.valueOf();
    }
    else if ((formatNum.length == 11) && (formatNum.slice(0,1) == '1')) {
      return '+' + formatNum.valueOf();
    }
    else { return null; }
  }

  // Take an internationally formatted phone number string and output a human-friendly
  // ex: +13038675309 -> (303) 867-5309
  phoneNumberOut(rawNum) {
    let formatNum = this.phoneNumberIn(rawNum);
    if (formatNum == null) { return ''; }
    if (formatNum.length == 0) { return ''; }
    if (formatNum.length == 12) {
      return '(' + formatNum.slice(2,5) + ') ' + formatNum.slice(5,8)
        + '-' + formatNum.slice(8,12);
    }
    else {
      return rawNum;
    }
  }
}

let utils = new Utils();
module.exports = utils;
