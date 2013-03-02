#!/usr/bin/perl -w


use strict;
use Data::Dumper;
use CB;
my $cb=new CB;
my $q = $cb->q;
my $db = $cb->db;
my ($anvid,$id) = $cb->anvid();


#print STDERR "(anvid,id) = ($anvid,$id)\n";

print $q->redirect(-uri=>'login.pl') unless $anvid;
#my $id=$q->param('id') || 1;

print $q->header(-type=>'text/html',-charset=>'utf-8');

if ($q->param('lopnummer') && $q->param('stansa')) {

    $db->do("insert into stodforklaring (id,lopnummer,pnr,fornamn,efternamn,fodelseort,datumtxt,datum,typ) values(?,?,?,?,?,?,?,?,?)", undef, $id,$q->param('lopnummer'),$q->param('pnr'),$q->param('fornamn'),$q->param('efternamn'),$q->param('fodelseort'),$q->param('datumtxt'),'2012-01-01','PAPPER');


}

my $lista = $db->selectall_arrayref("select b.lopnummer from stodforklaring a right join status b on(a.lopnummer=b.lopnummer and a.id=b.id) where b.id=? and a.lopnummer is null", { Slice => {} }, 
				  $id);

my @pop;
map {push @pop,$_->{lopnummer}} @$lista;

$q->delete_all();

print $q->start_html(-title=>'INI',
		     -style=>{-src=>'/~claes/ini.css'});
print $cb->meny();
print $cb->namn();


print $q->end_ul();
print $q->start_table({-border=>1});
print $q->Tr($q->td([qw(lopnummer pnr fornamn efternamn fodelseort datumtxt &nbsp;)]));
    print $q->start_form();
    print $q->hidden('id');
print $q->Tr($q->td([$q->popup_menu('lopnummer',\@pop), $q->textfield('pnr'), $q->textfield('fornamn'), $q->textfield('efternamn'), $q->textfield('fodelseort'), $q->textfield('datumtxt'),$q->submit(-name=>'stansa',-value=>'Stansa')]));


    print $q->end_form();
print $q->end_table();
print $q->start_table({-border=>1});
my $all = $db->selectall_arrayref("select a.* from stodforklaring a join status b on(a.lopnummer=b.lopnummer and a.id=b.id) where a.id=? order by ts desc", { Slice => {} }, 
				  $id);
print $q->Tr($q->td([qw(lopnummer pnr fornamn efternamn fodelseort datumtxt datum typ)]));
foreach my $in (@$all) {

    print $q->Tr($q->td([$in->{lopnummer},$in->{pnr},$in->{fornamn},$in->{efternamn},$in->{fodelseort},$in->{datumtxt},$in->{datum},$in->{typ}]));
}
print $q->end_table();
print $q->Dump();


print $q->end_html();

