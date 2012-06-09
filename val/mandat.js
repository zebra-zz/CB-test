function Mandat(totled) {
    this.totled = totled;
    this.jamkning = 1;
}

//console.log(Mandat.totrost());

Mandat.prototype = {
    laddadata: function(fastamandat,rosttal) {
	this.fastamandat = fastamandat || this.fasta;
	this.rosttal = rosttal;
    },
    initiering: function() {
	this.totrost = Mängd.sumsumvärde(this.rosttal);
	this.totfastmandat = Mängd.sumvärde(this.fastamandat);
	this.prockrets = this.prockretsf(this.rosttal);
	this.proc = this.procf(this.rosttal);
    },
    visa_totled: function() {
	return this.totled;    
    },
    visa_rosttal: function() {
	return this.rosttal;    
    },
    klarar_sparr: function() {
	this.subrosttal = this.sparr();
    },
    // Fördelar de fasta mandaten per valkrets
    fördelar_fastamandat: function() {
	var M={};
	var J={};	
	for (var v in this.subrosttal) {
	    var rost = this.subrosttal[v];
	    var m = Mängd.initobj(rost,0);

	    var mand = this.mandat(rost,m,this.fastamandat[v]);
	    M[v]=mand;

	    J[v]=this.listajmf;
	}
	this.mandfast=M;
	this.JMF=J;
    },
    summerar_total: function() {
	this.T = Mängd.sumvärdegrupp(Mängd.transponera(this.subrosttal));

	var m = Mängd.initobj(this.T,0);
	// Totala mandaten per parti
	var total = this.mandat(this.T,m,this.totled);
	this.propmand=total;
	this.total=total;
	// Fasta mandaten per parti
	console.log('this.mandfast');
	console.log(this.mandfast);
	this.totfast = Mängd.sumvärdegrupp(Mängd.transponera(this.mandfast));
    },
    inititerar_utjämningsmandat: function() {
	var uv={}
	for (var v in this.subrosttal) {
	    var rost = this.subrosttal[v];
	    var u = Mängd.initobj(rost,0);
	    uv[v]=u;
	}
	this.utjamn=uv;
    },
    // Röster per parti
    fördelar_utjämningsmandat: function() {

	// Utjämnings mandat
	var utj = Mängd.diff(this.total,this.totfast);

	// Partier som har fler fasta mandat än totalen
	var negp = Mängd.parti_negutjamn(utj);
	console.log('negp');
	console.log(negp);
	// Ny omgång
	var omgang = 0;
	
	var nytotled = this.totled;
	var nytotal=this.total;
	while(Mängd.antalnycklar(negp)) {
	    omgang++;
	    console.log('omgang');
	    console.log(omgang);
	    
	    var subsub = Mängd.sumvärde(Mängd.snitt(this.totfast,negp));
	    nytotled -= subsub;
	    
	    console.log(subsub);
	    
	    var min = Mängd.minus(nytotal,negp);
	    console.log('WHILE');

	    var m = Mängd.initobj(min,0);
	    
	    nytotal = this.mandat(this.T,m,nytotled);
	    console.log('nytotal');
	    console.log(nytotal);
	    var utj = Mängd.diff(nytotal,this.totfast);
	    negp = Mängd.parti_negutjamn(utj);
	    console.log('negp');
	    console.log(negp);
	    //    negp={};
	} 
	console.log('nytotal');
	console.log(nytotal);
	var min2 = Mängd.minus(this.totfast,nytotal);
	console.log(min2);
	// Ny total
	// union?
	
	var nytotal2 = Mängd.union(nytotal,this.totfast);
	console.log(nytotal2);
	// Korrekta totala utjämningsmandat
	var totutj = Mängd.diff(nytotal2,this.totfast);

	this.totutj = totutj;
    },

    // Fördelar utjämningsmandaten mellan valkretsar  
    fördelar_utjämningsmandat_mellan_kretsar: function() {
	var Mt = Mängd.transponera(this.mandfast);
	console.log(Mt);
	var Vt = Mängd.transponera(this.subrosttal);
	Vm={}
	this.jamkning = 0;
	var utjamnt={};
	for (p in Mt) {
	    var mt=Mt[p];
	    
	    var mand = this.mandat(Vt[p],Mt[p],this.totutj[p]);
	    utjamnt[p] = Mängd.diff(mand,Mt[p]);
	    
	    console.log('diffa');
	    console.log(utjamnt[p]);
	    Vm[p]=mand;
	    //Vm[p]
	}
	console.log(Vm);
	// Inderikt resultat 
	this.Vm=Vm;	
	this.utjamn = Mängd.transponera(utjamnt);
    },
    fasta_och_utjämningsmandat: function(){
	this.result = Mängd.addera(this.mandfast,this.utjamn);
//	this.result = Mängd.transponera(this.Vm);
	this.tottiparti = Mängd.sumvärdegrupp(Mängd.transponera(this.result));
    },
    beräkning: function() {
	this.initiering();
        this.klarar_sparr();
	this.fördelar_fastamandat();
	this.summerar_total();
	this.inititerar_utjämningsmandat();
	if (this.totled > this.totfastmandat) {
	    this.fördelar_utjämningsmandat();
	    this.fördelar_utjämningsmandat_mellan_kretsar();
	}
	this.fasta_och_utjämningsmandat();
    },
    mandat: function(rosttal,minit,antalmand,jamkning) {

	var jamkning = jamkning || this.jamkning;    
//Clone
	var m = Mängd.initobj(minit,minit);
	var jmf={};
	var lista=[];
	for (var p in m) { 	
	    jmf[p]=rosttal[p]/this.divisor(m[p]);	    
	}
	
	for (var i=1; i <= antalmand; i++){
	    var partier=this.maxparti(jmf);
	    var p;
	    var lotta=0;
	    if (partier.length==1) {
		p = partier[0];
	    }	
	    else {
		console.log('Lottning');
		p=partier[Math.floor(Math.random()*partier.length)];
		lotta++;
	    }
	    //	console.log(p);
	    m[p]++;

	    if (lotta) {
		lista.push([i,p,this.divisor(m[p]-1),jmf[p],'Lottning!']);
	    } 
	    else {
		lista.push([i,p,this.divisor(m[p]-1),jmf[p]]);
	    }
	    jmf[p]=rosttal[p]/this.divisor(m[p]);
	}

	this.listajmf=lista;
//	return {'m':m,'jmf':lista};
	return m;
    },
    divisor: function(m) {
	if (m==0 && this.jamkning==1) {
	    return 1.4;
	} 
	else {
	    return 2*m+1;
	}
    },
    maxparti:  function(jmf){
	var max=0;
	for (var p in jmf) {
	    if (jmf[p]>max) {
		max = jmf[p]
	    }
	}
	var maxparti=[];
	for (var p in jmf) {
	    if (jmf[p] == max) {
		maxparti.push(p);
	    }
	}
	return maxparti;
    },
    störstarest:function(totfast,roster) {
	var tot = Mängd.sumvärde(roster);
	var kv={};
	var rest = [];
	var vlista = [];
	for (var v in roster) {
	    var kvot = totfast*roster[v]/tot
	    kv[v] = Math.floor(kvot);
	    var re = kvot %  Math.floor(kvot);
	    rest.push(re);
	    vlista.push(v);
	}
	var totkv = Mängd.sumvärde(kv);
	var nyrest =rest.slice();
	nyrest.sort(function (a, b) {
	    return b - a;
	});
	console.log('nyrest');
	console.log(nyrest);
	console.log(kv);
	console.log(rest);
	console.log(vlista);
	var i =0;	
	while(totkv < totfast){
	    var rr = nyrest[i++];
	    var ind = rest.indexOf(rr)
	    kv[vlista[ind]] += 1;
	    totkv = Mängd.sumvärde(kv);	    
	}
	return kv;
    },
    beräkna_fastamandat: function(röstberättiga) {
	var antfast = this.totled;
	this.fasta = this.störstarest(antfast,röstberättiga)
    },
    visa_fastamandat: function() {
	return this.fasta;
    },
    sparr: function() {
	return this.rosttal
    },
    procf: function(rost){
	var tot = Mängd.sumsumvärde(rost);
	var ant = Mängd.sumvärdegrupp(Mängd.transponera(rost));
	var proc={};
	for (var i in ant) {
	    proc[i]=ant[i]/tot*100;
	}
	return proc;
    },
    prockretsf: function(rost){
	var proc={};

	var r=rost;
	for (var i in r) {
	    var sum = Mängd.sumvärde(r[i]);
	    
	    for (var j in r[i]) {
		if (typeof proc[i] == "undefined") {
		    proc[i]={};
		}
		proc[i][j]=r[i][j]/sum*100;
	    }
	}
	return proc;
    },
}
    


function Riksdag(totled,totfasta) {
    Mandat.call(this,totled);
    this.sparrgrans=4;
    this.kretssparrgrans=12;
    this.valtyp='R';
    this.totfasta = totfasta || 310;
}

Riksdag.prototype = new Mandat();
Riksdag.prototype.sparr = function() {
    var p=this.proc;
    var ok={};
    for (var i in p) {
	if (p[i]>=this.sparrgrans) {
	    ok[i]=1;
	}
    }
    var pr=this.prockrets;
    var rost=this.rosttal;
    var all={};
    for (var i in pr){
	for (var j in pr[i]){
	    if (typeof all[i] == "undefined") {
		all[i]={};
	    }
	    if(ok[j]) {
		all[i][j]=rost[i][j];
	    }
	    if (pr[i][j]>this.kretssparrgrans) {
		all[i][j]=rost[i][j];
	    }
	}
    }
    return all;
}
Riksdag.prototype.beräkna_fastamandat = function(röstberättiga) {
    var antfast = this.totfasta;
    this.fasta = this.störstarest(antfast,röstberättiga)
};

function Landsting(totled) {
    Mandat.call(this,totled);
    this.sparrgrans=3;
    this.valtyp='L';
    this.fastfaktor=0.9;
}
Landsting.prototype = new Mandat();
Landsting.prototype.sparr = function() {
    var p=this.proc;
    var ok={};
    for (var i in p) {
	if (p[i]>=this.sparrgrans) {
	    ok[i]=1;
	}
    }

    var rost=this.rosttal;
    var all={};
    for (var i in rost){
	for (var j in rost[i]){
	    if (typeof all[i] == "undefined") {
		all[i]={};
	    }
	    if(ok[j]) {
		all[i][j]=rost[i][j];
	    }

	}
    }
    return all;
}

Landsting.prototype.beräkna_fastamandat = function(röstberättiga) {
    var antfast = Math.floor(this.fastfaktor*this.totled);
    this.fasta = this.störstarest(antfast,röstberättiga)
};


function Kommun(totled) {
    Mandat.call(this,totled);
    this.valtyp='K';
}
Kommun.prototype = new Mandat();
Kommun.prototype.beräkna_fastamandat = function(röstberättiga) {
    var antfast = this.totled;
    var fasta = this.störstarest(antfast,röstberättiga)
    console.log('this.fastastart');
    console.log(fasta);

    var fastastart = Mängd.initobj(fasta,fasta);
    var omgang=0;
    var nya=antfast;
    while (Mängd.någon(fastastart,function(val) { return (val < 15) })) {
	omgang++;
	console.log('vvvvvv' + omgang);
	console.log(fastastart);
	var nyaroster={}

	for (var v in fastastart) {

	    console.log(v);
	    if (fastastart[v]<15) {
		fasta[v]=15;
		nya -= 15;
	    } 
	    else {
		nyaroster[v] = röstberättiga[v];
	    }
	}
	console.log('nyaroster');
	console.log(nyaroster);
	console.log(nya);
	fastastart = this.störstarest(nya,nyaroster);

	console.log(fastastart);
    }
    if (omgang) {
	for (var v in fastastart) {
	    fasta[v]=fastastart[v];
	}
    }
    console.log('fasta');
    console.log(fasta);
    console.log(fastastart);
    this.fasta=fasta;
};


var Mängd = {};
Mängd = {
    sumvärde: function(r) {
	var tot=0;
	for (var p in r) {
	    tot += r[p];
	}
	return tot;
    },
    
    sumsumvärde: function(r) {
	var tot=0;
	for (var v in r) {
	    tot += this.sumvärde(r[v]);
	}
	return tot;
    },
    sumvärdegrupp: function(r) {
	var tot={};
	for (var v in r) {
	    tot[v] = this.sumvärde(r[v]);
	}
	return tot;
    },
    parti_negutjamn: function(utj) {
	neg={};
	for (p in utj) {
	    if (utj[p]<0) {
		neg[p]=1;
	    }
	}
	return neg;
    },
    minus: function(A,B) {
	var minus={};
	var snitt={};
	for (var p in A) {
	    if ( B[p] ) {
		snitt[p]=A[p];
	    } else {
		minus[p]=A[p];
	    }
	}
	return minus;
    },
    snitt: function(A,B) {
	var minus={};
	var snitt={};
	for (var p in A) {
	    if ( B[p] ) {
		snitt[p]=A[p];
	    } else {
		minus[p]=A[p];
	    }
	}
	return snitt;
    },
    union: function(A,B) {
	var union={};
	for (var p in B)  {
	    union[p]=B[p];
	}
	for (var p in A) {
	    union[p]=A[p];
	} 	
	return union;
    },
    antalnycklar: function(A){
	var s=0;
	for (var i in A) {
	    s++;    
	}
	return s;
    },
    transponera: function(A) {
	var N={};
	for (var v in A) {
	    for (var p in A[v]) {
		if (typeof N[p] == "undefined") {
		    N[p]={};
		}
		
		N[p][v]=A[v][p];
	    }
	}
	return N;
    },
    initobj: function(r,v) {
	var val =v || 0;
	var m={};
	for (var j in r) {
	    if (typeof val === "object") {
		m[j] = val[j];
	    }
	    else {
		m[j] = val;
	    }  
	}
	return m;
    },
    diff: function(A,B) {
	var diff={};
	for (var p in A) {
	    diff[p] = A[p] - B[p];
	}
	return diff;
    },    
    addera: function(A,B) {
	add={};
	for (var p in A) {
	    if (typeof A[p] === 'object') {
		for (var q in A[p]) {
		    if (typeof add[p] == "undefined") {
			add[p]={};
		    }
		    add[p][q] = A[p][q] + B[p][q];
		}
	    } 
	    else {
		add[p]=A[p] + B[p];
	    }
	}
	return add;
    },
    skapatabell: function(obj,k0,k1) {
	var k0=k0 || 'a1';
	var k1=k1 || 'a2';
	a=[];
	for (var i  in obj) {
	    a.push({k0:i,k1:obj[i]});
	}
	return a;
    },
    adderakolumn: function(tab,key,obj,kol) {
	var k=kol || 'cccc';
	var key=key || 'k0';
	for (var i in tab) {
	    var v= tab[i][key];
	    tab[i][k]=obj[v];
	}
	return tab;
    },
    någon: function(d,tillbaka) {
	var n=0;
	for (var i in d) {
	    n += tillbaka(d[i]);
	}
	return n;
    }
};



/*

//var totled=33;
//var fastamandat={V1:7,V2:9,V3:13};
//var röstberättiga = {V1:7211,V2:9112,V3:1312};
//var rosttal = {'V1':{A:1401,B:1420,C:1430,D:1400},
//	       'V2':{A:233,B:344,C:311,D:923},
//	       'V3':{A:4233,B:5344,C:6311,D:212},
//	      };


var röstberättiga = {'Syd':7211,'Mellan':9112,'Norra':1312};


var totled=71;
var rosttal = {'Syd': {'M':7738,'S':14702,'F':2185,'C':4058,'V':1154,'Mp':1295,'Kd':793}, 
		 'Mellan':{'M':24999,'S':45710,'F':13058,'C':7612,'V':8604,'Mp':7189,'Kd':4270}, 
		 'Norra':{'M':4005,'S':19102,'F':1934,'C':4322,'V':1475,'Mp':1255,'Kd':641} 
		}
var fastamandat = {'Syd':12, 'Mellan':39, 'Norra':12};


// INSTANS
// totled,fastamandat,rosttal
var ny = new Kommun(totled);

console.log(rosttal);
console.log(fastamandat);
ny.beräkna_fastamandat(röstberättiga);
var rr = ny.visa_fastamandat();
console.log('rr');
console.log(rr);

//ny.laddadata(fastamandat,rosttal);
ny.laddadata(fastamandat,rosttal);

ny.beräkning();

console.log('ny.prockrets');
console.log(ny.prockrets);

console.log('ny.totrost');
console.log(ny.totrost);

console.log('ny.sparr()');
console.log(ny.sparr());
console.log(ny.result);
//console.log(ny.jamkning);
console.log(ny.T);


console.log(Mängd.sumsumvärde(ny.rosttal));
console.log(ny.totrost);
console.log('ny.totfastmandat');
console.log(ny.totfastmandat);


console.log('totfast')
console.log(ny.totfast);
console.log('ny.totutj')
console.log(ny.totutj);
console.log('ny.mandfast');
console.log(ny.mandfast);
console.log('ny.utjamn');
console.log(ny.utjamn);
console.log('ny.result');
console.log(ny.result);

console.log('tottiparti');
console.log(ny.tottiparti);
console.log('propmand')
console.log(ny.propmand);
console.log(ny.JMF);
//console.log(ny.subrosttal);
//console.log(ny.sparr());
var ta  = Mängd.skapatabell(ny.propmand);
console.log(ny.totfast);
var dd=Mängd.adderakolumn(ta,'k0',ny.totfast,'fast');
console.log(dd);
*/