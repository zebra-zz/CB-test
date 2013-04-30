function InvNormalP( p ) {
   // Odeh & Evans. 1974. AS 70. Applied Statistics. 23: 96-97
   var
      p0 = -0.322232431088,
      p1 = -1.0,
      p2 = -0.342242088547,
      p3 = -0.0204231210245,
      p4 = -0.453642210148E-4,
      q0 =  0.0993484626060,
      q1 =  0.588581570495,
      q2 =  0.531103462366,
      q3 =  0.103537752850,
      q4 =  0.38560700634E-2,
      pp, y, xp;

   // p: 0.0 .. 1.0 -> pp: 0.0 .. 0.5 .. 0.0
   if (p < 0.5)  pp = p;  else  pp = 1 - p;

   if (pp < 1E-12)
      xp = 99;
   else {
      y = Math.sqrt(Math.log(1/(pp*pp)));
      xp = y + ((((y * p4 + p3) * y + p2) * y + p1) * y + p0) /
               ((((y * q4 + q3) * y + q2) * y + q1) * y + q0);
      }

   if (p < 0.5)  return -xp;
   else  return  xp;
   }
function NormalP( x ) {
   // Abramowitz & Stegun 26.2.19
   var
    d1 = 0.0498673470,
    d2 = 0.0211410061,
    d3 = 0.0032776263,
    d4 = 0.0000380036,
    d5 = 0.0000488906,
    d6 = 0.0000053830;

    var a = Math.abs(x);
    var t = 1.0 + a*(d1+a*(d2+a*(d3+a*(d4+a*(d5+a*d6)))));

   // to 16th power
    t *= t;  t *= t;  t *= t;  t *= t;
    t = 1.0 / (t+t);  // the MINUS 16th

    if (x >= 0)  t = 1 - t;
    return t;
}

function sample(konf,BB,ep,NN) {


    k=konf/100;
    pp=(1+k)/2;

    var inv=InvNormalP( pp );
    var B = BB/100;
    var D = B*B/inv/inv;
    var p = ep/100;
    var q = 1 - p;
    var N =  NN;


    var n = Math.round(N*p*q/(D*(N-1) + p*q));

    return n;
}

