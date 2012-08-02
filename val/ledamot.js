function valda(liströst, kandidat2,mandat) {
    var kanditat= new cloneObject(kandidat2);
    var första={}
    var topp={};
    var platstal={};
    var röstetal={};
    var lista={};    
    var R={};
    var ledamot=[];
// init
    for (var L in kandidat) {
	var först=kandidat[L].shift();
	if (typeof topp[först] == "undefined") {
	    topp[först]=[];
	    R[först]=0;
	    röstetal[först]=0;
	    platstal[först]=0;
	}
	topp[först].push(L);
	R[först] += liströst[L];
	röstetal[först] += liströst[L];

    }
    console.log(topp);
	    var list=kandidat['L1'];
   var först=list.shift();
    console.log(list);
    console.log(först);

    for (var i=0;  i<mandat; i++) {
	var max= maxjmf(R);
	ledamot.push(max);
	console.log(i + ' max=' + max);
	console.log(topp[max]);
	var vv=topp[max];
	console.log(vv);
	for (var L in vv) {
	    console.log( vv[L] + '=' + kandidat[vv[L]]);
	    
	    var list=kandidat[vv[L]];
	console.log(list.length);
	    if(list.length) {
		console.log(list);
		var först=list.shift();
		console.log('först' + ' =' + först);
		if (typeof topp[först] == "undefined") {
		    topp[först]=[];
		    R[först]=0;
		    röstetal[först]=0;
		    platstal[först]=0;
		}
		topp[först].push(vv[L]);
		for (var L in topp[först]) {
		    console.log('LL ' + först + ' ' + topp[först][L]);
		    röstetal[först] += liströst[topp[först][L]];		    
		}
		console.log(först);
		console.log('röstetal');
		console.log(röstetal);
		platstal[först] += röstetal[först]/R[max];
		console.log(platstal);
		R[först]=röstetal[först]/(platstal[först]+1);

		console.log('R');
		console.log(R);

		
	    }
		console.log('MAX');
		console.log(max);
		delete topp[max]; 
		delete röstetal[max]; 
		delete platstal[max];
		delete R[max];
		console.log(topp);
		console.log(R);
	    
	}
    }
	
	console.log(ledamot);
    
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

function cloneObject(source) {
    for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        }
        else{
            this[i] = source[i];
	}
    }
}
 
var obj1= {bla:'blabla',foo:'foofoo',etc:'etc'};
 
var obj2= new cloneObject(obj1);

var liströst={'L1':3898,'L2':1478,'L3':3473};
var kandidat={'L1':['A','B','C'],'L2':['A','F','G'],'L3':['A','H','I']};
console.log(kandidat);
valda(liströst,kandidat,5);