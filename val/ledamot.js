function valda(liströst, kandidat2,mandat) {
    var kandidat= new cloneObject(kandidat2);
    var första={}
    var grupp={};
    var platstal={};
    var röstetal={};

    var R={};
    var ledamot=[];
// init
    for (var L in kandidat) {
	var först=kandidat[L].shift();
	if (typeof grupp[först] == "undefined") {
	    grupp[först]=[];
	    R[först]=0;
	    röstetal[först]=0;
	    platstal[först]=0;
	}
	grupp[först].push(L);
	R[först] += liströst[L];
	röstetal[först] += liströst[L];

    }
    console.log(grupp);

    for (var m=1;  m<=mandat; m++) {
	var max= maxjmf(R);
	ledamot.push({'nr':m,'leadmot':max,'platstal':platstal[max],'jmf':R[max]});
	console.log(m + ' max=' + max + ' R= ' + R[max]);
// Rensa
	console.log(kandidat);
	for (var K in kandidat) {
	    tabort_element(kandidat[K],max);
	}
	console.log('grupp[max]');
	console.log(grupp[max]);
	var listor = grupp[max];

	var toppar={};
	for (var j in listor) {
	    console.log( 'J=' + j + ' ' + listor[j] + '||=' + kandidat[listor[j]]);	    
	    var kandidater = kandidat[listor[j]];
	    console.log(kandidater.length);
	    if (kandidater.length) {
		console.log(kandidater);
		var först=kandidater.shift();
		
		console.log('först' + ' =' + först + ' ?? ' + j + 'BLA=' + listor[j]);
		if (typeof grupp[först] == "undefined") {
		    grupp[först]=[];
		    R[först]=0;
		    röstetal[först]=0;
		    platstal[först]=0;
		}
		if (typeof toppar[först] == "undefined") {
		    toppar[först]=0;
		}
		grupp[först].push(listor[j]);
		toppar[först] += liströst[listor[j]];
	    }
	}
	console.log('toppar');
	console.log(toppar);
	console.log(grupp);
	console.log(liströst);
	for (var top in toppar) {
	    console.log('LL ' + först + ' ' + toppar[top]);
	    platstal[top] += tvådecimal( toppar[top]/R[max] );
	    röstetal[top] += toppar[top];
	    R[top]=tvådecimal( röstetal[top]/(platstal[top]+1) );
	}
	console.log(först);
	console.log('röstetal');
	console.log(röstetal);
	console.log(R[max]);
	
	console.log('platstal');
	console.log(platstal);
	
	console.log('R');
	console.log(R);
	
	delete grupp[max]; 
	delete röstetal[max]; 
	delete platstal[max];
	delete R[max];
	
    }
    
    return ledamot;
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

function tvådecimal(f) {
    return Math.floor(f*100)/100;
}

function tabort_element(arr, vad) {
    var ind = arr.indexOf(vad);

    while (ind !== -1) {
        arr.splice(ind, 1);
        ind = arr.indexOf(vad);
    }
}
 


var liströst={'L1':3898,'L2':1478,'L3':3473};
var kandidat={'L1':['A','B','C'],'L2':['A','F','G','B'],'L3':['A','H','I']};
console.log(kandidat);
//var ledamot = valda(liströst,kandidat,5);
//console.log(ledamot);