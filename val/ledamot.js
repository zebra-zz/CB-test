function valda(liströst, kandidat,mandat) {
    var första={}

    var platstal=0;
    var lista={};    

    for (var i=0;  i<mandat; i++) {
	var R={};
	for (L in kandidat) {
	    console.log(L);
	    if (kandidat[L].length) {
		första[L]=kandidat[L].shift();
		console.log(första[L]);
		R[första[L]]=liströst[L]/(1+platstal);

		console.log(R);

	    }
	    var max= maxjmf(R);
		console.log('max');
		console.log(max);
	}
    }
 

}

function maxjmf(jmf){
    var max=0;
    for (var p in jmf) {
	if (jmf[p]>max) {
	    max = jmf[p]
	}
    }
//    var maxparti=[];
    for (var p in jmf) {
	if (jmf[p] == max) {
	    return p;
//	    maxparti.push(p);
	}
    }
//    return maxparti;
    }
var liströst={'L1':123,'L2':213};
var kandidat={'L1':['A','B','C'],'L2':['F','B','C']};

valda(liströst,kandidat,5);