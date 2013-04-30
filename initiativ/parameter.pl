#!/usr/bin/perl -w

use strict;
use Data::Dumper;
use CB;
my $cb=new CB;
my $q = $cb->q;
my $db = $cb->db;
if ($q->param('id')) {
    my $kaka = $q->cookie('INI');
    $db->do("update anvandare set initiativ=? where sid=?", {},$q->param('id'),$kaka);
}

my ($anvid,$id) = $cb->anvid();


print $q->redirect(-uri=>'login.pl') unless $anvid;




my $steg=$db->selectrow_array("select steg from initiativ where id=?", {}, $id);
if (my $filename = $q->param('uploaded_file')) {
    if ($db->selectrow_array("select count(1) from stodforklaring where id=? and typ='ONLINE'", {},$id)==0) { 
	my $antalpapper=$db->selectrow_array("select varde from parameter where id=? and nyckel='ANTAL_PAPPER'", {},$id) || 0;
	my $lop=$antalpapper;
	while (<$filename>) {
	    chomp;
	    $lop++;
	    
	    my @var=split(';');
	    print STDERR "@var "."\n";
	    $db->do("insert into stodforklaring (id,lopnummer,pnr,fornamn,efternamn,fodelseort,datumtxt,typ) values(?,?,?,?,?,?,?,?)", undef, $id,$lop,@var,'ONLINE');
	    $db->do("update parameter set varde=? where id=? and nyckel=?", {},1,$id,'LAS_ELEKTRONSIK_FIL');
	    $db->do("update initiativ set steg=? where id=?", {},$steg + 1,$id);
	}
    } 
    else {
	print STDERR "FINNS ONLINE";
    }    
}

if (my $filename = $q->param('folkfil')) {
    if ($db->selectrow_array("select count(1) from folkbokforingen where id=?", {},$id)==0) { 
	while (<$filename>) {
	    chomp;
	    
	    my @var=split(';');
	    print STDERR "@var "."\n";
	    $db->do("insert into folkbokforing (id,pnr2,fornamn2,efternamn2,fodelseort2) values(?,?,?,?,?)", undef,$id, @var);
	    $db->do("update parameter set varde=? where id=? and nyckel=?", {},1,$id,'LASFOLKBOKFORING');
	    $db->do("update initiativ set steg=? where id=?", {},$steg + 1,$id);
	}
    } 
    else {
	print STDERR "FINNS ONLINE";
    }    
}

if ($q->param('urval')) {
    print STDERR "URVAL\n";
    my $tot=$db->selectrow_array("select varde from parameter where id=? and nyckel='ANTAL_TOTAL'", {}, 
				 $id);
    foreach my $i (1..$tot) {
    print STDERR "INSERT URVAL = $i : $id\n";
	$db->do("insert into utvald (id,lopnummer,slump) values(?,?,rand())", {},
		$id,$i);
    }
    my $urval=$db->selectrow_array("select varde from parameter where id=? and nyckel='STICKPROV'", {}, 
				   $id);
    $db->do("insert into status (id,lopnummer) select id,lopnummer from utvald where id=? order by slump limit ?;", {},$id,$urval);
    $db->do("update parameter set varde=? where id=? and nyckel=?", {},1,$id,'URVAL');
   $db->do("update initiativ set steg=? where id=?", {},$steg + 1,$id);
}

if ($q->param('auto')) {
    my $all = $db->selectall_arrayref("select * from stodforklaring a join status b on(a.lopnummer=b.lopnummer and a.id=b.id) 
join folkbokforing c on (a.pnr=c.pnr2 and a.id=c.id) 
join initiativ i on (a.id=i.id)
where b.id=?  order by ts desc", { Slice => {} }, 
				  $id);

    foreach my $d (@$all) {
	my $fn=0;
	foreach my $namn (split(/\s+/,$d->{fornamn})) {
	    $fn++ if $d->{fornamn2} =~ /$namn/;
	}
	my $en=0;
	foreach my $namn (split(/\s+/,$d->{efternamn})) {
	    $en++ if $d->{efternamn2} =~ /$namn/;
	}
	print STDERR "FF $fn $en\n";
	if ($fn && $en) { 
	    $db->do("update status set godkand=1,orsak=2 where id=? and lopnummer=?", {},$id,$d->{lopnummer});
	}
    }
    
    print STDERR Dumper($all);
    $db->do("update parameter set varde=? where id=? and nyckel=?", {},1,$id,'AUTO');
    $db->do("update initiativ set steg=? where id=?", {},$steg + 1,$id);
}

if ($q->param('namnini')) {
    foreach my $param ($q->param()) {
	print STDERR "PARAM = $param,$steg\n";
	if ($db->selectrow_array("select count(1) from parameter_ordning where nyckel=? and steg=?", {}, $param,$steg)) {
	print STDERR "UPPDATERA $id,$param\n";
	    $db->do("update parameter set varde=? where id=? and nyckel=?", {},$q->param($param),$id,$param);
	}
    }
    print STDERR "UPPDATERA STEG\n";
    $db->do("update initiativ set steg=? where id=?", {},$steg + 1,$id);
}



$steg=$db->selectrow_array("select steg from initiativ where id=?", {}, $id);

print $q->header(-type=>'text/html',-charset=>'utf-8');

#print $q->start_html(-title=>'INI',-style=>{-src=>'/~claes/initiativ.css'});
print $q->start_html(-title=>'INI',-script=>{-type=>'text/javascript',
					     -src=>'../../ini.js'},
		     -style=>{-src=>$cb->{css}});



print $cb->meny();
print $cb->namn();
#print $q->Dump();

print $q->p();


my $all = $db->selectall_arrayref("select * from parameter where id=?", { Slice => {} }, $id);
print $q->start_ul();
my $falt=0;

print $q->start_form(-action=>$q->url(-relative=>1));
foreach my $in (@$all) {

    if ($db->selectrow_array("select count(1) from parameter_ordning where nyckel=? and steg=?", {},$in->{nyckel},$steg)) {

	print STDERR "STEG $steg\n";
#    print STDERR Dumper($in);

	if ($in->{nyckel}=~/^LAS/) {
	    print $q->start_multipart_form(-action=>$q->url(-relative=>1));
	    print $in->{nyckel}.$q->br();
	    my $filnamn=($in->{nyckel} eq 'LAS_ELEKTRONSIK_FIL') ? 'uploaded_file' : 'folkfil';
	    print $q->filefield($filnamn,'starting value',50,80);
	    print $q->submit();
	    print $q->end_form();
	} 
	else {
	    $falt++;
	    if ($in->{nyckel} eq 'ANTAL_ONLINE') {
		my $antonline= $db->selectrow_array("select count(1) from stodforklaring where id=? and typ='ONLINE'", {},$id);
		$q->param('ANTAL_ONLINE',$antonline);
		print $q->li($in->{nyckel}.'<br>'.$q->textfield(-name=>$in->{nyckel},-value=>$in->{varde}));

	    }
	    elsif ($in->{nyckel} eq 'ANTAL_TOTAL') {
		print $q->li($in->{nyckel}.'<br>'.$q->textfield(-name=>$in->{nyckel},-value=>$in->{varde}));
		print $q->button(-value=>'Summera',-onClick=>'this.form.ANTAL_TOTAL.value = parseFloat(this.form.ANTAL_PAPPER.value) + parseFloat(this.form.ANTAL_ONLINE.value);');
	    }
	    elsif ($in->{nyckel} eq 'STICKPROV') {
		print $q->li($in->{nyckel}.'<br>'.$q->textfield(-name=>$in->{nyckel},-value=>$in->{varde}));
		print $q->button(-value=>'Beräkna',-onClick=>'this.form.STICKPROV.value=sample(this.form.KONFIDENSGRAD.value,this.form.FELMARGINAL.value,this.form.FORVANTAD_FELFREKVENS.value,this.form.ANTAL_TOTAL.value)');
	    } 
	    elsif ($in->{nyckel} eq 'URVAL') {
		if ($db->selectrow_array("select count(1) from utvald where id=?", {},$id)==0) { 
		    $falt=0;
		    print $q->hidden(-name=>$in->{nyckel},-value=>1);
		   print $q->submit(-name=>'urval',-value=>'Urval');

		}
	    }
	    elsif ($in->{nyckel} eq 'AUTO') {
		    $falt=0;
		    print $q->hidden(-name=>$in->{nyckel},-value=>1);
		    print $q->submit(-name=>'auto',-value=>'Auto');
	    }
	    else {
		print $q->li($in->{nyckel}.'<br>'.$q->textfield(-name=>$in->{nyckel},-value=>$in->{varde}));
	    }

	}
    }
    else {
	print $q->hidden(-name=>$in->{nyckel},-value=>$in->{varde});
	print $q->li($in->{nyckel}.'<br>'.$q->p($in->{varde}));
    }

}
print $q->li($q->submit(-name=>'namnini',-value=>'Spara')) if $falt;
	print $q->end_form();
print $q->end_ul();




print $q->end_html();
