#!/usr/bin/perl -w

use strict;
use Data::Dumper;
use CB;
my $cb=new CB;
my $q = $cb->q;
my $db = $cb->db;
my ($anvid,$id) = $cb->anvid();

print $q->redirect(-uri=>'login.pl') unless $anvid;



print $q->header(-type=>'text/html',-charset=>'utf-8');
if ($q->param('lopnummer')) {
#    print "UPPDATERA ". $q->param('lopnummer')."\n";
	$db->do("update status set godkand=?,orsak=? where id=? and lopnummer=?", {},$q->param('godkand'),$q->param('orsak'),$id,$q->param('lopnummer'));
}

print $q->start_html(-title=>'INI',
		     -style=>{-src=>$cb->{css}});



print $cb->meny();
print $cb->namn();

print $q->start_table({-border=>1});
my $subsql = ($q->param('EJOK')) ? 'and godkand=0' : '';
my $all = $db->selectall_arrayref("select * from stodforklaring a right join status b on(a.lopnummer=b.lopnummer and a.id=b.id) 
left join folkbokforing c on (a.pnr=c.pnr2 and a.id=c.id) where b.id=? $subsql order by ts desc", { Slice => {} }, 
				  $id);
#print STDERR Dumper($all);
my $namn = $db->selectall_arrayref("select * from orsak order by ord", { Slice => {} });
my %orsak=();
my %godkand=();
foreach my $in (@$namn) {
    $orsak{$in->{orsak}}=$in->{orsak_txt};
    $godkand{$in->{godkand}}=$in->{godkand_txt};
}


print $q->start_form(-action=>$q->url(-relative=>1)).$q->checkbox(-name=>'EJOK',-value=>1,-onchange=>"submit()",-label=>'Ej godkända').$q->end_form();
#print $q->Dump();
print $q->Tr($q->td([qw(lopnummer pnr fornamn efternamn fodelseort datumtxt datum typ godkand orsak &nbsp; fornamn_f efternamn_e)]));
#print $q->Dump();
$q->delete('lopnummer','godkand','orsak');
foreach my $in (@$all) {
    $q->param('godkand',$in->{godkand});
    $q->param('orsak',$in->{orsak});
#    print STDERR Dumper($in);
    print $q->Tr($q->td([$in->{lopnummer},$in->{pnr} || '',$in->{fornamn} || '',$in->{efternamn} || '',$in->{fodelseort} || '',$in->{datumtxt} || '',$in->{datum} || '',$in->{typ} || '']),
		 $q->td([$in->{godkand},$in->{orsak} || '']),
$q->td([$q->start_form().$q->popup_menu(-name=>'godkand',-values=>[keys %godkand],-labels=>\%godkand).$q->popup_menu(-name=>'orsak',-values=>[keys %orsak],-labels=>\%orsak).$q->hidden('lopnummer',$in->{lopnummer}).$q->hidden('EJOK').$q->submit().$q->end_form()]),
$q->td([$in->{fornamn2},$in->{efternamn2}])
);
}
print $q->end_table();



print $q->end_html();
