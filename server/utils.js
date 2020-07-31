class Utils {
  seed;
  rand;

  constructor() {
    let seedNum = parseInt(new Date(Date.now()).valueOf().toString().slice(-4));
    this.seed = seedNum ^ 0xDEADBEEF; // 32-bit seed with optional XOR value
    // Pad seed with Phi, Pi and E.
    // https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
    this.rand = this.sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, this.seed);
  }

  sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
  }

  randHex(len) {
    let maxlen = 8;
    let min = Math.pow(16,Math.min(len,maxlen)-1);
    let max = Math.pow(16,Math.min(len,maxlen)) - 1;
    let n = Math.floor( this.rand() * (max-min+1) ) + min;
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
