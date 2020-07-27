class Utils {
  seed: number;
  rand: Function;

  constructor() {
    this.seed = 2330 ^ 0xDEADBEEF; // 32-bit seed with optional XOR value
    // Pad seed with Phi, Pi and E.
    // https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
    this.rand = this.sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, this.seed);
  }

  sfc32(a: number, b: number, c: number, d: number) {
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
}

export let utils = new Utils();
