// ----- Big Integer -----//
// (public) Constructor function of Global BigInteger object
var BigInteger = window.BigInteger = function BigInteger(a, b, c) {
  if (a != null)
    if ("number" == typeof a) this.fromNumber(a, b, c);
    else if (b == null && "string" != typeof a) this.fromString(a, 256);
    else this.fromString(a, b);
};

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this[i++] + w[j] + c;
    c = Math.floor(v / 0x4000000);
    w[j++] = v & 0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff, xh = x >> 15;
  while (--n >= 0) {
    var l = this[i] & 0x7fff;
    var h = this[i++] >> 15;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
    w[j++] = l & 0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff, xh = x >> 14;
  while (--n >= 0) {
    var l = this[i] & 0x3fff;
    var h = this[i++] >> 14;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
    c = (l >> 28) + (m >> 14) + xh * h;
    w[j++] = l & 0xfffffff;
  }
  return c;
}
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if (j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c == null) ? -1 : c;
}



// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }


// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if ((t = x >>> 16) != 0) { x = t; r += 16; }
  if ((t = x >> 8) != 0) { x = t; r += 8; }
  if ((t = x >> 4) != 0) { x = t; r += 4; }
  if ((t = x >> 2) != 0) { x = t; r += 2; }
  if ((t = x >> 1) != 0) { x = t; r += 1; }
  return r;
}

// (protected) copy this to r
BigInteger.prototype.copyTo = function (r) {
  for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
};

// (protected) set from integer value x, -DV <= x < DV
BigInteger.prototype.fromInt = function (x) {
  this.t = 1;
  this.s = (x < 0) ? -1 : 0;
  if (x > 0) this[0] = x;
  else if (x < -1) this[0] = x + this.DV;
  else this.t = 0;
};

// (protected) set from string and radix
BigInteger.prototype.fromString = function (s, b) {
  var k;
  if (b == 16) k = 4;
  else if (b == 8) k = 3;
  else if (b == 256) k = 8; // byte array
  else if (b == 2) k = 1;
  else if (b == 32) k = 5;
  else if (b == 4) k = 2;
  else { this.fromRadix(s, b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while (--i >= 0) {
    var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if (sh == 0)
      this[this.t++] = x;
    else if (sh + k > this.DB) {
      this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
      this[this.t++] = (x >> (this.DB - sh));
    }
    else
      this[this.t - 1] |= x << sh;
    sh += k;
    if (sh >= this.DB) sh -= this.DB;
  }
  if (k == 8 && (s[0] & 0x80) != 0) {
    this.s = -1;
    if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
  }
  this.clamp();
  if (mi) BigInteger.ZERO.subTo(this, this);
};


// (protected) clamp off excess high words
BigInteger.prototype.clamp = function () {
  var c = this.s & this.DM;
  while (this.t > 0 && this[this.t - 1] == c) --this.t;
};

// (protected) r = this << n*DB
BigInteger.prototype.dlShiftTo = function (n, r) {
  var i;
  for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
  for (i = n - 1; i >= 0; --i) r[i] = 0;
  r.t = this.t + n;
  r.s = this.s;
};

// (protected) r = this >> n*DB
BigInteger.prototype.drShiftTo = function (n, r) {
  for (var i = n; i < this.t; ++i) r[i - n] = this[i];
  r.t = Math.max(this.t - n, 0);
  r.s = this.s;
};

// (protected) r = this << n
BigInteger.prototype.lShiftTo = function (n, r) {
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << cbs) - 1;
  var ds = Math.floor(n / this.DB), c = (this.s << bs) & this.DM, i;
  for (i = this.t - 1; i >= 0; --i) {
    r[i + ds + 1] = (this[i] >> cbs) | c;
    c = (this[i] & bm) << bs;
  }
  for (i = ds - 1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t + ds + 1;
  r.s = this.s;
  r.clamp();
};

// (protected) r = this >> n
BigInteger.prototype.rShiftTo = function (n, r) {
  r.s = this.s;
  var ds = Math.floor(n / this.DB);
  if (ds >= this.t) { r.t = 0; return; }
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << bs) - 1;
  r[0] = this[ds] >> bs;
  for (var i = ds + 1; i < this.t; ++i) {
    r[i - ds - 1] |= (this[i] & bm) << cbs;
    r[i - ds] = this[i] >> bs;
  }
  if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
  r.t = this.t - ds;
  r.clamp();
};

// (protected) r = this - a
BigInteger.prototype.subTo = function (a, r) {
  var i = 0, c = 0, m = Math.min(a.t, this.t);
  while (i < m) {
    c += this[i] - a[i];
    r[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c -= a.s;
    while (i < this.t) {
      c += this[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while (i < a.t) {
      c -= a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c < 0) ? -1 : 0;
  if (c < -1) r[i++] = this.DV + c;
  else if (c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
};

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
BigInteger.prototype.multiplyTo = function (a, r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i + y.t;
  while (--i >= 0) r[i] = 0;
  for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
  r.s = 0;
  r.clamp();
  if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
};

// (protected) r = this^2, r != this (HAC 14.16)
BigInteger.prototype.squareTo = function (r) {
  var x = this.abs();
  var i = r.t = 2 * x.t;
  while (--i >= 0) r[i] = 0;
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x[i], r, 2 * i, 0, 1);
    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
      r[i + x.t] -= x.DV;
      r[i + x.t + 1] = 1;
    }
  }
  if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
  r.s = 0;
  r.clamp();
};

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
BigInteger.prototype.divRemTo = function (m, q, r) {
  var pm = m.abs();
  if (pm.t <= 0) return;
  var pt = this.abs();
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0);
    if (r != null) this.copyTo(r);
    return;
  }
  if (r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
  if (nsh > 0) { pm.lShiftTo(nsh, y); pt.lShiftTo(nsh, r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys - 1];
  if (y0 == 0) return;
  var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
  var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
  var i = r.t, j = i - ys, t = (q == null) ? nbi() : q;
  y.dlShiftTo(j, t);
  if (r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t, r);
  }
  BigInteger.ONE.dlShiftTo(ys, t);
  t.subTo(y, y); // "negative" y so we can replace sub with am later
  while (y.t < ys) y[y.t++] = 0;
  while (--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {  // Try it out
      y.dlShiftTo(j, t);
      r.subTo(t, r);
      while (r[i] < --qd) r.subTo(t, r);
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q);
    if (ts != ms) BigInteger.ZERO.subTo(q, q);
  }
  r.t = ys;
  r.clamp();
  if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
  if (ts < 0) BigInteger.ZERO.subTo(r, r);
};

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
BigInteger.prototype.invDigit = function () {
  if (this.t < 1) return 0;
  var x = this[0];
  if ((x & 1) == 0) return 0;
  var y = x & 3;  // y == 1/x mod 2^2
  y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
  y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
  y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y * (2 - x * y % this.DV)) % this.DV;  // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y > 0) ? this.DV - y : -y;
};

// (protected) true iff this is even
BigInteger.prototype.isEven = function () { return ((this.t > 0) ? (this[0] & 1) : this.s) == 0; };

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
BigInteger.prototype.exp = function (e, z) {
  if (e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
  g.copyTo(r);
  while (--i >= 0) {
    z.sqrTo(r, r2);
    if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
};

// (public) return string representation in given radix
BigInteger.prototype.toString = function (b) {
  if (this.s < 0) return "-" + this.negate().toString(b);
  var k;
  if (b == 16) k = 4;
  else if (b == 8) k = 3;
  else if (b == 2) k = 1;
  else if (b == 32) k = 5;
  else if (b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
  var p = this.DB - (i * this.DB) % k;
  if (i-- > 0) {
    if (p < this.DB && (d = this[i] >> p) > 0) { m = true; r = int2char(d); }
    while (i >= 0) {
      if (p < k) {
        d = (this[i] & ((1 << p) - 1)) << (k - p);
        d |= this[--i] >> (p += this.DB - k);
      }
      else {
        d = (this[i] >> (p -= k)) & km;
        if (p <= 0) { p += this.DB; --i; }
      }
      if (d > 0) m = true;
      if (m) r += int2char(d);
    }
  }
  return m ? r : "0";
};

// (public) -this
BigInteger.prototype.negate = function () { var r = nbi(); BigInteger.ZERO.subTo(this, r); return r; };

// (public) |this|
BigInteger.prototype.abs = function () { return (this.s < 0) ? this.negate() : this; };

// (public) return + if this > a, - if this < a, 0 if equal
BigInteger.prototype.compareTo = function (a) {
  var r = this.s - a.s;
  if (r != 0) return r;
  var i = this.t;
  r = i - a.t;
  if (r != 0) return (this.s < 0) ? -r : r;
  while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
  return 0;
}

// (public) return the number of bits in "this"
BigInteger.prototype.bitLength = function () {
  if (this.t <= 0) return 0;
  return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
};

// (public) this mod a
BigInteger.prototype.mod = function (a) {
  var r = nbi();
  this.abs().divRemTo(a, null, r);
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
  return r;
}

// (public) this^e % m, 0 <= e < 2^32
BigInteger.prototype.modPowInt = function (e, m) {
  var z;
  if (e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e, z);
};

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Extended JavaScript BN functions, required for RSA private ops.
// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if (x == 0) return -1;
  var r = 0;
  if ((x & 0xffff) == 0) { x >>= 16; r += 16; }
  if ((x & 0xff) == 0) { x >>= 8; r += 8; }
  if ((x & 0xf) == 0) { x >>= 4; r += 4; }
  if ((x & 3) == 0) { x >>= 2; r += 2; }
  if ((x & 1) == 0) ++r;
  return r;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while (x != 0) { x &= x - 1; ++r; }
  return r;
}

var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

// (protected) return x s.t. r^x < DV
BigInteger.prototype.chunkSize = function (r) { return Math.floor(Math.LN2 * this.DB / Math.log(r)); };

// (protected) convert to radix string
BigInteger.prototype.toRadix = function (b) {
  if (b == null) b = 10;
  if (this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b, cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d, y, z);
  while (y.signum() > 0) {
    r = (a + z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d, y, z);
  }
  return z.intValue().toString(b) + r;
};

// (protected) convert from radix string
BigInteger.prototype.fromRadix = function (s, b) {
  this.fromInt(0);
  if (b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b * w + x;
    if (++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w, 0);
      j = 0;
      w = 0;
    }
  }
  if (j > 0) {
    this.dMultiply(Math.pow(b, j));
    this.dAddOffset(w, 0);
  }
  if (mi) BigInteger.ZERO.subTo(this, this);
};

// (protected) alternate constructor
BigInteger.prototype.fromNumber = function (a, b, c) {
  if ("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if (a < 2) this.fromInt(1);
    else {
      this.fromNumber(a, c);
      if (!this.testBit(a - 1)) // force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
      if (this.isEven()) this.dAddOffset(1, 0); // force odd
      while (!this.isProbablePrime(b)) {
        this.dAddOffset(2, 0);
        if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a & 7;
    x.length = (a >> 3) + 1;
    b.nextBytes(x);
    if (t > 0) x[0] &= ((1 << t) - 1); else x[0] = 0;
    this.fromString(x, 256);
  }
};

// (protected) r = this op a (bitwise)
BigInteger.prototype.bitwiseTo = function (a, op, r) {
  var i, f, m = Math.min(a.t, this.t);
  for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
  if (a.t < this.t) {
    f = a.s & this.DM;
    for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
    r.t = this.t;
  }
  else {
    f = this.s & this.DM;
    for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
    r.t = a.t;
  }
  r.s = op(this.s, a.s);
  r.clamp();
};

// (protected) this op (1<<n)
BigInteger.prototype.changeBit = function (n, op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r, op, r);
  return r;
};

// (protected) r = this + a
BigInteger.prototype.addTo = function (a, r) {
  var i = 0, c = 0, m = Math.min(a.t, this.t);
  while (i < m) {
    c += this[i] + a[i];
    r[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c += a.s;
    while (i < this.t) {
      c += this[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while (i < a.t) {
      c += a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c < 0) ? -1 : 0;
  if (c > 0) r[i++] = c;
  else if (c < -1) r[i++] = this.DV + c;
  r.t = i;
  r.clamp();
};

// (protected) this *= n, this >= 0, 1 < n < DV
BigInteger.prototype.dMultiply = function (n) {
  this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
  ++this.t;
  this.clamp();
};

// (protected) this += n << w words, this >= 0
BigInteger.prototype.dAddOffset = function (n, w) {
  if (n == 0) return;
  while (this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while (this[w] >= this.DV) {
    this[w] -= this.DV;
    if (++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
};

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
  var i = Math.min(this.t + a.t, n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while (i > 0) r[--i] = 0;
  var j;
  for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
  for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
  r.clamp();
};


// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
  --n;
  var i = r.t = this.t + a.t - n;
  r.s = 0; // assumes a,this >= 0
  while (--i >= 0) r[i] = 0;
  for (i = Math.max(n - this.t, 0); i < a.t; ++i)
    r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
  r.clamp();
  r.drShiftTo(1, r);
};

// (protected) this % n, n < 2^26
BigInteger.prototype.modInt = function (n) {
  if (n <= 0) return 0;
  var d = this.DV % n, r = (this.s < 0) ? n - 1 : 0;
  if (this.t > 0)
    if (d == 0) r = this[0] % n;
    else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
  return r;
};

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
BigInteger.prototype.millerRabin = function (t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if (k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t + 1) >> 1;
  if (t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for (var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
    var y = a.modPow(r, this);
    if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while (j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2, this);
        if (y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if (y.compareTo(n1) != 0) return false;
    }
  }
  return true;
};

// (public)
BigInteger.prototype.clone = function () { var r = nbi(); this.copyTo(r); return r; };

// (public) return value as integer
BigInteger.prototype.intValue = function () {
  if (this.s < 0) {
    if (this.t == 1) return this[0] - this.DV;
    else if (this.t == 0) return -1;
  }
  else if (this.t == 1) return this[0];
  else if (this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
};

// (public) return value as byte
BigInteger.prototype.byteValue = function () { return (this.t == 0) ? this.s : (this[0] << 24) >> 24; };

// (public) return value as short (assumes DB>=16)
BigInteger.prototype.shortValue = function () { return (this.t == 0) ? this.s : (this[0] << 16) >> 16; };

// (public) 0 if this == 0, 1 if this > 0
BigInteger.prototype.signum = function () {
  if (this.s < 0) return -1;
  else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
};

// (public) convert to bigendian byte array
BigInteger.prototype.toByteArray = function () {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB - (i * this.DB) % 8, d, k = 0;
  if (i-- > 0) {
    if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
      r[k++] = d | (this.s << (this.DB - p));
    while (i >= 0) {
      if (p < 8) {
        d = (this[i] & ((1 << p) - 1)) << (8 - p);
        d |= this[--i] >> (p += this.DB - 8);
      }
      else {
        d = (this[i] >> (p -= 8)) & 0xff;
        if (p <= 0) { p += this.DB; --i; }
      }
      if ((d & 0x80) != 0) d |= -256;
      if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
      if (k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
};

BigInteger.prototype.equals = function (a) { return (this.compareTo(a) == 0); };
BigInteger.prototype.min = function (a) { return (this.compareTo(a) < 0) ? this : a; };
BigInteger.prototype.max = function (a) { return (this.compareTo(a) > 0) ? this : a; };

// (public) this & a
function op_and(x, y) { return x & y; }
BigInteger.prototype.and = function (a) { var r = nbi(); this.bitwiseTo(a, op_and, r); return r; };

// (public) this | a
function op_or(x, y) { return x | y; }
BigInteger.prototype.or = function (a) { var r = nbi(); this.bitwiseTo(a, op_or, r); return r; };

// (public) this ^ a
function op_xor(x, y) { return x ^ y; }
BigInteger.prototype.xor = function (a) { var r = nbi(); this.bitwiseTo(a, op_xor, r); return r; };

// (public) this & ~a
function op_andnot(x, y) { return x & ~y; }
BigInteger.prototype.andNot = function (a) { var r = nbi(); this.bitwiseTo(a, op_andnot, r); return r; };

// (public) ~this
BigInteger.prototype.not = function () {
  var r = nbi();
  for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
};

// (public) this << n
BigInteger.prototype.shiftLeft = function (n) {
  var r = nbi();
  if (n < 0) this.rShiftTo(-n, r); else this.lShiftTo(n, r);
  return r;
};

// (public) this >> n
BigInteger.prototype.shiftRight = function (n) {
  var r = nbi();
  if (n < 0) this.lShiftTo(-n, r); else this.rShiftTo(n, r);
  return r;
};

// (public) returns index of lowest 1-bit (or -1 if none)
BigInteger.prototype.getLowestSetBit = function () {
  for (var i = 0; i < this.t; ++i)
    if (this[i] != 0) return i * this.DB + lbit(this[i]);
  if (this.s < 0) return this.t * this.DB;
  return -1;
};

// (public) return number of set bits
BigInteger.prototype.bitCount = function () {
  var r = 0, x = this.s & this.DM;
  for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
  return r;
};

// (public) true iff nth bit is set
BigInteger.prototype.testBit = function (n) {
  var j = Math.floor(n / this.DB);
  if (j >= this.t) return (this.s != 0);
  return ((this[j] & (1 << (n % this.DB))) != 0);
};

// (public) this | (1<<n)
BigInteger.prototype.setBit = function (n) { return this.changeBit(n, op_or); };
// (public) this & ~(1<<n)
BigInteger.prototype.clearBit = function (n) { return this.changeBit(n, op_andnot); };
// (public) this ^ (1<<n)
BigInteger.prototype.flipBit = function (n) { return this.changeBit(n, op_xor); };
// (public) this + a
BigInteger.prototype.add = function (a) { var r = nbi(); this.addTo(a, r); return r; };
// (public) this - a
BigInteger.prototype.subtract = function (a) { var r = nbi(); this.subTo(a, r); return r; };
// (public) this * a
BigInteger.prototype.multiply = function (a) { var r = nbi(); this.multiplyTo(a, r); return r; };
// (public) this / a
BigInteger.prototype.divide = function (a) { var r = nbi(); this.divRemTo(a, r, null); return r; };
// (public) this % a
BigInteger.prototype.remainder = function (a) { var r = nbi(); this.divRemTo(a, null, r); return r; };
// (public) [this/a,this%a]
BigInteger.prototype.divideAndRemainder = function (a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a, q, r);
  return new Array(q, r);
};

// (public) this^e % m (HAC 14.85)
BigInteger.prototype.modPow = function (e, m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if (i <= 0) return r;
  else if (i < 18) k = 1;
  else if (i < 48) k = 3;
  else if (i < 144) k = 4;
  else if (i < 768) k = 5;
  else k = 6;
  if (i < 8)
    z = new Classic(m);
  else if (m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
  g[1] = z.convert(this);
  if (k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1], g2);
    while (n <= km) {
      g[n] = nbi();
      z.mulTo(g2, g[n - 2], g[n]);
      n += 2;
    }
  }

  var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j]) - 1;
  while (j >= 0) {
    if (i >= k1) w = (e[j] >> (i - k1)) & km;
    else {
      w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
      if (j > 0) w |= e[j - 1] >> (this.DB + i - k1);
    }

    n = k;
    while ((w & 1) == 0) { w >>= 1; --n; }
    if ((i -= n) < 0) { i += this.DB; --j; }
    if (is1) {  // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while (n > 1) { z.sqrTo(r, r2); z.sqrTo(r2, r); n -= 2; }
      if (n > 0) z.sqrTo(r, r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2, g[w], r);
    }

    while (j >= 0 && (e[j] & (1 << i)) == 0) {
      z.sqrTo(r, r2); t = r; r = r2; r2 = t;
      if (--i < 0) { i = this.DB - 1; --j; }
    }
  }
  return z.revert(r);
};

// (public) 1/this % m (HAC 14.61)
BigInteger.prototype.modInverse = function (m) {
  var ac = m.isEven();
  if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while (u.signum() != 0) {
    while (u.isEven()) {
      u.rShiftTo(1, u);
      if (ac) {
        if (!a.isEven() || !b.isEven()) { a.addTo(this, a); b.subTo(m, b); }
        a.rShiftTo(1, a);
      }
      else if (!b.isEven()) b.subTo(m, b);
      b.rShiftTo(1, b);
    }
    while (v.isEven()) {
      v.rShiftTo(1, v);
      if (ac) {
        if (!c.isEven() || !d.isEven()) { c.addTo(this, c); d.subTo(m, d); }
        c.rShiftTo(1, c);
      }
      else if (!d.isEven()) d.subTo(m, d);
      d.rShiftTo(1, d);
    }
    if (u.compareTo(v) >= 0) {
      u.subTo(v, u);
      if (ac) a.subTo(c, a);
      b.subTo(d, b);
    }
    else {
      v.subTo(u, v);
      if (ac) c.subTo(a, c);
      d.subTo(b, d);
    }
  }
  if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if (d.compareTo(m) >= 0) return d.subtract(m);
  if (d.signum() < 0) d.addTo(m, d); else return d;
  if (d.signum() < 0) return d.add(m); else return d;
};

// (public) this^e
BigInteger.prototype.pow = function (e) { return this.exp(e, new NullExp()); };

// (public) gcd(this,a) (HAC 14.54)
BigInteger.prototype.gcd = function (a) {
  var x = (this.s < 0) ? this.negate() : this.clone();
  var y = (a.s < 0) ? a.negate() : a.clone();
  if (x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if (g < 0) return x;
  if (i < g) g = i;
  if (g > 0) {
    x.rShiftTo(g, x);
    y.rShiftTo(g, y);
  }
  while (x.signum() > 0) {
    if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
    if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
    if (x.compareTo(y) >= 0) {
      x.subTo(y, x);
      x.rShiftTo(1, x);
    }
    else {
      y.subTo(x, y);
      y.rShiftTo(1, y);
    }
  }
  if (g > 0) y.lShiftTo(g, y);
  return y;
};

// (public) test primality with certainty >= 1-.5^t
BigInteger.prototype.isProbablePrime = function (t) {
  var i, x = this.abs();
  if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
    for (i = 0; i < lowprimes.length; ++i)
      if (x[0] == lowprimes[i]) return true;
    return false;
  }
  if (x.isEven()) return false;
  i = 1;
  while (i < lowprimes.length) {
    var m = lowprimes[i], j = i + 1;
    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while (i < j) if (m % lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
};

// JSBN-specific extension

// (public) this^2
BigInteger.prototype.square = function () { var r = nbi(); this.squareTo(r); return r; };
// NOTE: BigInteger interfaces not implemented in jsbn:
// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

// Copyright Stephan Thomas (start) --- //
// https://raw.github.com/bitcoinjs/bitcoinjs-lib/07f9d55ccb6abd962efb6befdd37671f85ea4ff9/src/util.js
// BigInteger monkey patching
BigInteger.valueOf = nbv;

/**
* Returns a byte array representation of the big integer.
*
* This returns the absolute of the contained value in big endian
* form. A value of zero results in an empty array.
*/
BigInteger.prototype.toByteArrayUnsigned = function () {
  var ba = this.abs().toByteArray();
  if (ba.length) {
    if (ba[0] == 0) {
      ba = ba.slice(1);
    }
    return ba.map(function (v) {
      return (v < 0) ? v + 256 : v;
    });
  } else {
    // Empty array, nothing to do
    return ba;
  }
};

/**
* Turns a byte array into a big integer.
*
* This function will interpret a byte array as a big integer in big
* endian notation and ignore leading zeros.
*/
BigInteger.fromByteArrayUnsigned = function (ba) {
  if (!ba.length) {
    return ba.valueOf(0);
  } else if (ba[0] & 0x80) {
    // Prepend a zero so the BigInteger class doesn't mistake this
    // for a negative integer.
    return new BigInteger([0].concat(ba));
  } else {
    return new BigInteger(ba);
  }
};

/**
* Converts big integer to signed byte representation.
*
* The format for this value uses a the most significant bit as a sign
* bit. If the most significant bit is already occupied by the
* absolute value, an extra byte is prepended and the sign bit is set
* there.
*
* Examples:
*
*      0 =>     0x00
*      1 =>     0x01
*     -1 =>     0x81
*    127 =>     0x7f
*   -127 =>     0xff
*    128 =>   0x0080
*   -128 =>   0x8080
*    255 =>   0x00ff
*   -255 =>   0x80ff
*  16300 =>   0x3fac
* -16300 =>   0xbfac
*  62300 => 0x00f35c
* -62300 => 0x80f35c
*/
BigInteger.prototype.toByteArraySigned = function () {
  var val = this.abs().toByteArrayUnsigned();
  var neg = this.compareTo(BigInteger.ZERO) < 0;

  if (neg) {
    if (val[0] & 0x80) {
      val.unshift(0x80);
    } else {
      val[0] |= 0x80;
    }
  } else {
    if (val[0] & 0x80) {
      val.unshift(0x00);
    }
  }

  return val;
};

/**
* Parse a signed big integer byte representation.
*
* For details on the format please see BigInteger.toByteArraySigned.
*/
BigInteger.fromByteArraySigned = function (ba) {
  // Check for negative value
  if (ba[0] & 0x80) {
    // Remove sign bit
    ba[0] &= 0x7f;

    return BigInteger.fromByteArrayUnsigned(ba).negate();
  } else {
    return BigInteger.fromByteArrayUnsigned(ba);
  }
};
// Copyright Stephan Thomas (end) --- //

// ****** REDUCTION ******* //

// Modular reduction using "classic" algorithm
var Classic = window.Classic = function Classic(m) { this.m = m; }
Classic.prototype.convert = function (x) {
  if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
};
Classic.prototype.revert = function (x) { return x; };
Classic.prototype.reduce = function (x) { x.divRemTo(this.m, null, x); };
Classic.prototype.mulTo = function (x, y, r) { x.multiplyTo(y, r); this.reduce(r); };
Classic.prototype.sqrTo = function (x, r) { x.squareTo(r); this.reduce(r); };

// Montgomery reduction
var Montgomery = window.Montgomery = function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp & 0x7fff;
  this.mph = this.mp >> 15;
  this.um = (1 << (m.DB - 15)) - 1;
  this.mt2 = 2 * m.t;
}
// xR mod m
Montgomery.prototype.convert = function (x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t, r);
  r.divRemTo(this.m, null, r);
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
  return r;
}
// x/R mod m
Montgomery.prototype.revert = function (x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
};
// x = x/R mod m (HAC 14.32)
Montgomery.prototype.reduce = function (x) {
  while (x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0;
  for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i] & 0x7fff;
    var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t;
    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
    // propagate carry
    while (x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t, x);
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
};
// r = "xy/R mod m"; x,y != r
Montgomery.prototype.mulTo = function (x, y, r) { x.multiplyTo(y, r); this.reduce(r); };
// r = "x^2/R mod m"; x != r
Montgomery.prototype.sqrTo = function (x, r) { x.squareTo(r); this.reduce(r); };

// A "null" reducer
var NullExp = window.NullExp = function NullExp() { }
NullExp.prototype.convert = function (x) { return x; };
NullExp.prototype.revert = function (x) { return x; };
NullExp.prototype.mulTo = function (x, y, r) { x.multiplyTo(y, r); };
NullExp.prototype.sqrTo = function (x, r) { x.squareTo(r); };

// Barrett modular reduction
var Barrett = window.Barrett = function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}
Barrett.prototype.convert = function (x) {
  if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
  else if (x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
};
Barrett.prototype.revert = function (x) { return x; };
// x = x mod m (HAC 14.42)
Barrett.prototype.reduce = function (x) {
  x.drShiftTo(this.m.t - 1, this.r2);
  if (x.t > this.m.t + 1) { x.t = this.m.t + 1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
  this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
  while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
  x.subTo(this.r2, x);
  while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
};
// r = x*y mod m; x,y != r
Barrett.prototype.mulTo = function (x, y, r) { x.multiplyTo(y, r); this.reduce(r); };
// r = x^2 mod m; x != r
Barrett.prototype.sqrTo = function (x, r) { x.squareTo(r); this.reduce(r); };

// ----- Bitcoin -----//
export let Bitcoin = {};

//https://raw.github.com/bitcoinjs/bitcoinjs-lib/09e8c6e184d6501a0c2c59d73ca64db5c0d3eb95/src/address.js
Bitcoin.Address = function (bytes) {
if ("string" == typeof bytes) {
  bytes = Bitcoin.Address.decodeString(bytes);
}
this.hash = bytes;
};

/**
* Serialize this object as a standard currency address.
*
* Returns the address as a base58-encoded string in the standardized format.
*/
Bitcoin.Address.prototype.toString = function () {
// Get a copy of the hash
var hash = this.hash.slice(0);

// Version
hash.unshift('0x3c'); // KMD
var checksum = Crypto.SHA256(Crypto.SHA256(hash, { asBytes: true }), { asBytes: true });
var bytes = hash.concat(checksum.slice(0, 4));
return Bitcoin.Base58.encode(bytes);
};

Bitcoin.Address.prototype.getHashBase64 = function () {
return Crypto.util.bytesToBase64(this.hash);
};

/**
* Parse a Bitcoin address contained in a string.
*/
Bitcoin.Address.decodeString = function (string) {
var bytes = Bitcoin.Base58.decode(string);
var hash = bytes.slice(0, 21);
var checksum = Crypto.SHA256(Crypto.SHA256(hash, { asBytes: true }), { asBytes: true });

if (checksum[0] != bytes[21] ||
    checksum[1] != bytes[22] ||
    checksum[2] != bytes[23] ||
    checksum[3] != bytes[24]) {
  throw "Checksum validation failed!";
}

return hash;
};

Bitcoin.Base58 = {
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  validRegex: /^[1-9A-HJ-NP-Za-km-z]+$/,
  base: BigInteger.valueOf(58),

  /**
  * Convert a byte array to a base58-encoded string.
  *
  * Written by Mike Hearn for BitcoinJ.
  *   Copyright (c) 2011 Google Inc.
  *
  * Ported to JavaScript by Stefan Thomas.
  */
  encode: function (input) {
    var bi = BigInteger.fromByteArrayUnsigned(input);
    var chars = [];

    while (bi.compareTo(B58.base) >= 0) {
      var mod = bi.mod(B58.base);
      chars.unshift(B58.alphabet[mod.intValue()]);
      bi = bi.subtract(mod).divide(B58.base);
    }
    chars.unshift(B58.alphabet[bi.intValue()]);

    // Convert leading zeros too.
    for (var i = 0; i < input.length; i++) {
      if (input[i] == 0x00) {
        chars.unshift(B58.alphabet[0]);
      } else break;
    }

    return chars.join('');
  },

  /**
  * Convert a base58-encoded string to a byte array.
  *
  * Written by Mike Hearn for BitcoinJ.
  *   Copyright (c) 2011 Google Inc.
  *
  * Ported to JavaScript by Stefan Thomas.
  */
  decode: function (input) {
    var bi = BigInteger.valueOf(0);
    var leadingZerosNum = 0;
    for (var i = input.length - 1; i >= 0; i--) {
      var alphaIndex = B58.alphabet.indexOf(input[i]);
      if (alphaIndex < 0) {
        throw "Invalid character";
      }
      bi = bi.add(BigInteger.valueOf(alphaIndex)
              .multiply(B58.base.pow(input.length - 1 - i)));

      // This counts leading zero bytes
      if (input[i] == "1") leadingZerosNum++;
      else leadingZerosNum = 0;
    }
    var bytes = bi.toByteArrayUnsigned();

    // Add leading zeros
    while (leadingZerosNum-- > 0) bytes.unshift(0);

    return bytes;
  }
};

const B58 = Bitcoin.Base58;

Bitcoin.ECDSA = (function () {
  var ecparams = EllipticCurve.getSECCurveByName("secp256k1");
  var rng = new SecureRandom();

  var P_OVER_FOUR = null;

  function implShamirsTrick(P, k, Q, l) {
    var m = Math.max(k.bitLength(), l.bitLength());
    var Z = P.add2D(Q);
    var R = P.curve.getInfinity();

    for (var i = m - 1; i >= 0; --i) {
      R = R.twice2D();

      R.z = BigInteger.ONE;

      if (k.testBit(i)) {
        if (l.testBit(i)) {
          R = R.add2D(Z);
        } else {
          R = R.add2D(P);
        }
      } else {
        if (l.testBit(i)) {
          R = R.add2D(Q);
        }
      }
    }

    return R;
  };

  var ECDSA = {
    getBigRandom: function (limit) {
      return new BigInteger(limit.bitLength(), rng)
        .mod(limit.subtract(BigInteger.ONE))
        .add(BigInteger.ONE);
    },
    sign: function (hash, priv) {
      var d = priv;
      var n = ecparams.getN();
      var e = BigInteger.fromByteArrayUnsigned(hash);

      do {
        var k = ECDSA.getBigRandom(n);
        var G = ecparams.getG();
        var Q = G.multiply(k);
        var r = Q.getX().toBigInteger().mod(n);
      } while (r.compareTo(BigInteger.ZERO) <= 0);

      var s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n);

      return ECDSA.serializeSig(r, s);
    },

    verify: function (hash, sig, pubkey) {
      var r, s;
      if (Bitcoin.Util.isArray(sig)) {
        var obj = ECDSA.parseSig(sig);
        r = obj.r;
        s = obj.s;
      } else if ("object" === typeof sig && sig.r && sig.s) {
        r = sig.r;
        s = sig.s;
      } else {
        throw "Invalid value for signature";
      }

      var Q;
      if (pubkey instanceof ec.PointFp) {
        Q = pubkey;
      } else if (Bitcoin.Util.isArray(pubkey)) {
        Q = EllipticCurve.PointFp.decodeFrom(ecparams.getCurve(), pubkey);
      } else {
        throw "Invalid format for pubkey value, must be byte array or ec.PointFp";
      }
      var e = BigInteger.fromByteArrayUnsigned(hash);

      return ECDSA.verifyRaw(e, r, s, Q);
    },

    verifyRaw: function (e, r, s, Q) {
      var n = ecparams.getN();
      var G = ecparams.getG();

      if (r.compareTo(BigInteger.ONE) < 0 ||
          r.compareTo(n) >= 0)
        return false;

      if (s.compareTo(BigInteger.ONE) < 0 ||
          s.compareTo(n) >= 0)
        return false;

      var c = s.modInverse(n);

      var u1 = e.multiply(c).mod(n);
      var u2 = r.multiply(c).mod(n);

      // TODO(!!!): For some reason Shamir's trick isn't working with
      // signed message verification!? Probably an implementation
      // error!
      //var point = implShamirsTrick(G, u1, Q, u2);
      var point = G.multiply(u1).add(Q.multiply(u2));

      var v = point.getX().toBigInteger().mod(n);

      return v.equals(r);
    },

    /**
    * Serialize a signature into DER format.
    *
    * Takes two BigIntegers representing r and s and returns a byte array.
    */
    serializeSig: function (r, s) {
      var rBa = r.toByteArraySigned();
      var sBa = s.toByteArraySigned();

      var sequence = [];
      sequence.push(0x02); // INTEGER
      sequence.push(rBa.length);
      sequence = sequence.concat(rBa);

      sequence.push(0x02); // INTEGER
      sequence.push(sBa.length);
      sequence = sequence.concat(sBa);

      sequence.unshift(sequence.length);
      sequence.unshift(0x30); // SEQUENCE

      return sequence;
    },

    /**
    * Parses a byte array containing a DER-encoded signature.
    *
    * This function will return an object of the form:
    *
    * {
    *   r: BigInteger,
    *   s: BigInteger
    * }
    */
    parseSig: function (sig) {
      var cursor;
      if (sig[0] != 0x30)
        throw new Error("Signature not a valid DERSequence");

      cursor = 2;
      if (sig[cursor] != 0x02)
        throw new Error("First element in signature must be a DERInteger"); ;
      var rBa = sig.slice(cursor + 2, cursor + 2 + sig[cursor + 1]);

      cursor += 2 + sig[cursor + 1];
      if (sig[cursor] != 0x02)
        throw new Error("Second element in signature must be a DERInteger");
      var sBa = sig.slice(cursor + 2, cursor + 2 + sig[cursor + 1]);

      cursor += 2 + sig[cursor + 1];

      //if (cursor != sig.length)
      //  throw new Error("Extra bytes in signature");

      var r = BigInteger.fromByteArrayUnsigned(rBa);
      var s = BigInteger.fromByteArrayUnsigned(sBa);

      return { r: r, s: s };
    },

    parseSigCompact: function (sig) {
      if (sig.length !== 65) {
        throw "Signature has the wrong length";
      }

      // Signature is prefixed with a type byte storing three bits of
      // information.
      var i = sig[0] - 27;
      if (i < 0 || i > 7) {
        throw "Invalid signature type";
      }

      var n = ecparams.getN();
      var r = BigInteger.fromByteArrayUnsigned(sig.slice(1, 33)).mod(n);
      var s = BigInteger.fromByteArrayUnsigned(sig.slice(33, 65)).mod(n);

      return { r: r, s: s, i: i };
    },

    /**
    * Recover a public key from a signature.
    *
    * See SEC 1: Elliptic Curve Cryptography, section 4.1.6, "Public
    * Key Recovery Operation".
    *
    * http://www.secg.org/download/aid-780/sec1-v2.pdf
    */
    recoverPubKey: function (r, s, hash, i) {
      // The recovery parameter i has two bits.
      i = i & 3;

      // The less significant bit specifies whether the y coordinate
      // of the compressed point is even or not.
      var isYEven = i & 1;

      // The more significant bit specifies whether we should use the
      // first or second candidate key.
      var isSecondKey = i >> 1;

      var n = ecparams.getN();
      var G = ecparams.getG();
      var curve = ecparams.getCurve();
      var p = curve.getQ();
      var a = curve.getA().toBigInteger();
      var b = curve.getB().toBigInteger();

      // We precalculate (p + 1) / 4 where p is if the field order
      if (!P_OVER_FOUR) {
        P_OVER_FOUR = p.add(BigInteger.ONE).divide(BigInteger.valueOf(4));
      }

      // 1.1 Compute x
      var x = isSecondKey ? r.add(n) : r;

      // 1.3 Convert x to point
      var alpha = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(p);
      var beta = alpha.modPow(P_OVER_FOUR, p);

      var xorOdd = beta.isEven() ? (i % 2) : ((i + 1) % 2);
      // If beta is even, but y isn't or vice versa, then convert it,
      // otherwise we're done and y == beta.
      var y = (beta.isEven() ? !isYEven : isYEven) ? beta : p.subtract(beta);

      // 1.4 Check that nR is at infinity
      var R = new EllipticCurve.PointFp(curve,
                            curve.fromBigInteger(x),
                            curve.fromBigInteger(y));
      R.validate();

      // 1.5 Compute e from M
      var e = BigInteger.fromByteArrayUnsigned(hash);
      var eNeg = BigInteger.ZERO.subtract(e).mod(n);

      // 1.6 Compute Q = r^-1 (sR - eG)
      var rInv = r.modInverse(n);
      var Q = implShamirsTrick(R, s, G, eNeg).multiply(rInv);

      Q.validate();
      if (!ECDSA.verifyRaw(e, r, s, Q)) {
        throw "Pubkey recovery unsuccessful";
      }

      var pubKey = new Bitcoin.ECKey();
      pubKey.pub = Q;
      return pubKey;
    },

    /**
    * Calculate pubkey extraction parameter.
    *
    * When extracting a pubkey from a signature, we have to
    * distinguish four different cases. Rather than putting this
    * burden on the verifier, Bitcoin includes a 2-bit value with the
    * signature.
    *
    * This function simply tries all four cases and returns the value
    * that resulted in a successful pubkey recovery.
    */
    calcPubkeyRecoveryParam: function (address, r, s, hash) {
      for (var i = 0; i < 4; i++) {
        try {
          var pubkey = Bitcoin.ECDSA.recoverPubKey(r, s, hash, i);
          if (pubkey.getBitcoinAddress().toString() == address) {
            return i;
          }
        } catch (e) { }
      }
      throw "Unable to find valid recovery factor";
    }
  };

  return ECDSA;
})();

Bitcoin.ECKey = (function () {
  var ECDSA = Bitcoin.ECDSA;
  var ecparams = EllipticCurve.getSECCurveByName("secp256k1");
  var rng = new SecureRandom();

  var ECKey = function (input) {
    if (!input) {
      // Generate new key
      var n = ecparams.getN();
      this.priv = ECDSA.getBigRandom(n);
    } else if (input instanceof BigInteger) {
      // Input is a private key value
      this.priv = input;
    } else if (Bitcoin.Util.isArray(input)) {
      // Prepend zero byte to prevent interpretation as negative integer
      this.priv = BigInteger.fromByteArrayUnsigned(input);
    } else if ("string" == typeof input) {
      var bytes = null;
      if (ECKey.isWalletImportFormat(input)) {
        bytes = ECKey.decodeWalletImportFormat(input);
      } else if (ECKey.isCompressedWalletImportFormat(input)) {
        bytes = ECKey.decodeCompressedWalletImportFormat(input);
        this.compressed = true;
      } else if (ECKey.isMiniFormat(input)) {
        bytes = Crypto.SHA256(input, { asBytes: true });
      } else if (ECKey.isHexFormat(input)) {
        bytes = Crypto.util.hexToBytes(input);
      } else if (ECKey.isBase64Format(input)) {
        bytes = Crypto.util.base64ToBytes(input);
      }

      if (ECKey.isBase6Format(input)) {
        this.priv = new BigInteger(input, 6);
      } else if (bytes == null || bytes.length != 32) {
        this.priv = null;
      } else {
        // Prepend zero byte to prevent interpretation as negative integer
        this.priv = BigInteger.fromByteArrayUnsigned(bytes);
      }
    }

    this.compressed = (this.compressed == undefined) ? !!ECKey.compressByDefault : this.compressed;
  };

  /**
  * Whether public keys should be returned compressed by default.
  */
  ECKey.compressByDefault = false;

  /**
  * Set whether the public key should be returned compressed or not.
  */
  ECKey.prototype.setCompressed = function (v) {
    this.compressed = !!v;
    if (this.pubPoint) this.pubPoint.compressed = this.compressed;
    return this;
  };

  /*
  * Return public key as a byte array in DER encoding
  */
  ECKey.prototype.getPub = function () {
    if (this.compressed) {
      if (this.pubComp) return this.pubComp;
      return this.pubComp = this.getPubPoint().getEncoded(1);
    } else {
      if (this.pubUncomp) return this.pubUncomp;
      return this.pubUncomp = this.getPubPoint().getEncoded(0);
    }
  };

  /**
  * Return public point as ECPoint object.
  */
  ECKey.prototype.getPubPoint = function () {
    if (!this.pubPoint) {
      this.pubPoint = ecparams.getG().multiply(this.priv);
      this.pubPoint.compressed = this.compressed;
    }
    return this.pubPoint;
  };

  ECKey.prototype.getPubKeyHex = function () {
    if (this.compressed) {
      if (this.pubKeyHexComp) return this.pubKeyHexComp;
      return this.pubKeyHexComp = Crypto.util.bytesToHex(this.getPub()).toString().toUpperCase();
    } else {
      if (this.pubKeyHexUncomp) return this.pubKeyHexUncomp;
      return this.pubKeyHexUncomp = Crypto.util.bytesToHex(this.getPub()).toString().toUpperCase();
    }
  };

  /**
  * Get the pubKeyHash for this key.
  *
  * This is calculated as RIPE160(SHA256([encoded pubkey])) and returned as
  * a byte array.
  */
  ECKey.prototype.getPubKeyHash = function () {
    if (this.compressed) {
      if (this.pubKeyHashComp) return this.pubKeyHashComp;
      return this.pubKeyHashComp = Bitcoin.Util.sha256ripe160(this.getPub());
    } else {
      if (this.pubKeyHashUncomp) return this.pubKeyHashUncomp;
      return this.pubKeyHashUncomp = Bitcoin.Util.sha256ripe160(this.getPub());
    }
  };

  ECKey.prototype.getBitcoinAddress = function () {
    var hash = this.getPubKeyHash();
    var addr = new Bitcoin.Address(hash);
    return addr.toString();
  };

  /*
  * Takes a public point as a hex string or byte array
  */
  ECKey.prototype.setPub = function (pub) {
    // byte array
    if (Bitcoin.Util.isArray(pub)) {
      pub = Crypto.util.bytesToHex(pub).toString().toUpperCase();
    }
    var ecPoint = ecparams.getCurve().decodePointHex(pub);
    this.setCompressed(ecPoint.compressed);
    this.pubPoint = ecPoint;
    return this;
  };

  // Sipa Private Key Wallet Import Format
  ECKey.prototype.getBitcoinWalletImportFormat = function () {
    var bytes = this.getBitcoinPrivateKeyByteArray();
    bytes.unshift('0xbc'); // prepend private key prefix // KMD
    if (this.compressed) bytes.push(0x01); // append 0x01 byte for compressed format
    var checksum = Crypto.SHA256(Crypto.SHA256(bytes, { asBytes: true }), { asBytes: true });
    bytes = bytes.concat(checksum.slice(0, 4));
    var privWif = Bitcoin.Base58.encode(bytes);
    return privWif;
  };

  // Private Key Hex Format
  ECKey.prototype.getBitcoinHexFormat = function () {
    return Crypto.util.bytesToHex(this.getBitcoinPrivateKeyByteArray()).toString().toUpperCase();
  };

  // Private Key Base64 Format
  ECKey.prototype.getBitcoinBase64Format = function () {
    return Crypto.util.bytesToBase64(this.getBitcoinPrivateKeyByteArray());
  };

  ECKey.prototype.getBitcoinPrivateKeyByteArray = function () {
    // Get a copy of private key as a byte array
    var bytes = this.priv.toByteArrayUnsigned();
    // zero pad if private key is less than 32 bytes
    while (bytes.length < 32) bytes.unshift(0x00);
    return bytes;
  };

  ECKey.prototype.toString = function (format) {
    format = format || "";
    if (format.toString().toLowerCase() == "base64" || format.toString().toLowerCase() == "b64") {
      return this.getBitcoinBase64Format();
    }
    // Wallet Import Format
    else if (format.toString().toLowerCase() == "wif") {
      return this.getBitcoinWalletImportFormat();
    }
    else {
      return this.getBitcoinHexFormat();
    }
  };

  ECKey.prototype.sign = function (hash) {
    return ECDSA.sign(hash, this.priv);
  };

  ECKey.prototype.verify = function (hash, sig) {
    return ECDSA.verify(hash, sig, this.getPub());
  };

  /**
  * Parse a wallet import format private key contained in a string.
  */
  ECKey.decodeWalletImportFormat = function (privStr) {
    var bytes = Bitcoin.Base58.decode(privStr);
    var hash = bytes.slice(0, 33);
    var checksum = Crypto.SHA256(Crypto.SHA256(hash, { asBytes: true }), { asBytes: true });
    if (checksum[0] != bytes[33] ||
          checksum[1] != bytes[34] ||
          checksum[2] != bytes[35] ||
          checksum[3] != bytes[36]) {
      throw "Checksum validation failed!";
    }
    var version = hash.shift();
        // TODO: detect currency
    if (version != janin.currency.privateKeyPrefix()) {
      throw "Version " + version + " not supported!";
    }
    return hash;
  };

  /**
  * Parse a compressed wallet import format private key contained in a string.
  */
  ECKey.decodeCompressedWalletImportFormat = function (privStr) {
    var bytes = Bitcoin.Base58.decode(privStr);
    var hash = bytes.slice(0, 34);
    var checksum = Crypto.SHA256(Crypto.SHA256(hash, { asBytes: true }), { asBytes: true });
    if (checksum[0] != bytes[34] ||
          checksum[1] != bytes[35] ||
          checksum[2] != bytes[36] ||
          checksum[3] != bytes[37]) {
      throw "Checksum validation failed!";
    }
    var version = hash.shift();
        // TODO: detect currency
    if (version != janin.currency.privateKeyPrefix()) {
      throw "Version " + version + " not supported!";
    }
    hash.pop();
    return hash;
  };

  // 64 characters [0-9A-F]
  ECKey.isHexFormat = function (key) {
    key = key.toString();
    return /^[A-Fa-f0-9]{64}$/.test(key);
  };

  // 51 characters base58, always starts with a '5'
  ECKey.isWalletImportFormat = function (key) {
    key = key.toString();
    return janin.currency.WIF_RegEx().test(key);
  };

  // 52 characters base58
  ECKey.isCompressedWalletImportFormat = function (key) {
    key = key.toString();
    return janin.currency.CWIF_RegEx().test(key);
  };

  // 44 characters
  ECKey.isBase64Format = function (key) {
    key = key.toString();
    return (/^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+\/]{44}$/.test(key));
  };

  // 99 characters, 1=1, if using dice convert 6 to 0
  ECKey.isBase6Format = function (key) {
    key = key.toString();
    return (/^[012345]{99}$/.test(key));
  };

  // 22, 26 or 30 characters, always starts with an 'S'
  ECKey.isMiniFormat = function (key) {
    key = key.toString();
    var validChars22 = /^S[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{21}$/.test(key);
    var validChars26 = /^S[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{25}$/.test(key);
    var validChars30 = /^S[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{29}$/.test(key);
    var testBytes = Crypto.SHA256(key + "?", { asBytes: true });

    return ((testBytes[0] === 0x00 || testBytes[0] === 0x01) && (validChars22 || validChars26 || validChars30));
  };

  return ECKey;
})();

//https://raw.github.com/bitcoinjs/bitcoinjs-lib/09e8c6e184d6501a0c2c59d73ca64db5c0d3eb95/src/util.js
// Bitcoin utility functions
Bitcoin.Util = {
  /**
  * Cross-browser compatibility version of Array.isArray.
  */
  isArray: Array.isArray || function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  },
  /**
  * Create an array of a certain length filled with a specific value.
  */
  makeFilledArray: function (len, val) {
    var array = [];
    var i = 0;
    while (i < len) {
      array[i++] = val;
    }
    return array;
  },
  /**
  * Turn an integer into a "var_int".
  *
  * "var_int" is a variable length integer used by Bitcoin's binary format.
  *
  * Returns a byte array.
  */
  numToVarInt: function (i) {
    if (i < 0xfd) {
      // unsigned char
      return [i];
    } else if (i <= 1 << 16) {
      // unsigned short (LE)
      return [0xfd, i >>> 8, i & 255];
    } else if (i <= 1 << 32) {
      // unsigned int (LE)
      return [0xfe].concat(Crypto.util.wordsToBytes([i]));
    } else {
      // unsigned long long (LE)
      return [0xff].concat(Crypto.util.wordsToBytes([i >>> 32, i]));
    }
  },
  /**
  * Parse a Bitcoin value byte array, returning a BigInteger.
  */
  valueToBigInt: function (valueBuffer) {
    if (valueBuffer instanceof BigInteger) return valueBuffer;

    // Prepend zero byte to prevent interpretation as negative integer
    return BigInteger.fromByteArrayUnsigned(valueBuffer);
  },
  /**
  * Format a Bitcoin value as a string.
  *
  * Takes a BigInteger or byte-array and returns that amount of Bitcoins in a
  * nice standard formatting.
  *
  * Examples:
  * 12.3555
  * 0.1234
  * 900.99998888
  * 34.00
  */
  formatValue: function (valueBuffer) {
    var value = this.valueToBigInt(valueBuffer).toString();
    var integerPart = value.length > 8 ? value.substr(0, value.length - 8) : '0';
    var decimalPart = value.length > 8 ? value.substr(value.length - 8) : value;
    while (decimalPart.length < 8) decimalPart = "0" + decimalPart;
    decimalPart = decimalPart.replace(/0*$/, '');
    while (decimalPart.length < 2) decimalPart += "0";
    return integerPart + "." + decimalPart;
  },
  /**
  * Parse a floating point string as a Bitcoin value.
  *
  * Keep in mind that parsing user input is messy. You should always display
  * the parsed value back to the user to make sure we understood his input
  * correctly.
  */
  parseValue: function (valueString) {
    // TODO: Detect other number formats (e.g. comma as decimal separator)
    var valueComp = valueString.split('.');
    var integralPart = valueComp[0];
    var fractionalPart = valueComp[1] || "0";
    while (fractionalPart.length < 8) fractionalPart += "0";
    fractionalPart = fractionalPart.replace(/^0+/g, '');
    var value = BigInteger.valueOf(parseInt(integralPart));
    value = value.multiply(BigInteger.valueOf(100000000));
    value = value.add(BigInteger.valueOf(parseInt(fractionalPart)));
    return value;
  },
  /**
  * Calculate RIPEMD160(SHA256(data)).
  *
  * Takes an arbitrary byte array as inputs and returns the hash as a byte
  * array.
  */
  sha256ripe160: function (data) {
    return Crypto.RIPEMD160(Crypto.SHA256(data, { asBytes: true }), { asBytes: true });
  },
  // double sha256
  dsha256: function (data) {
    return Crypto.SHA256(Crypto.SHA256(data, { asBytes: true }), { asBytes: true });
  }
};