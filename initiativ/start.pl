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


if ($q->param('start')) {
	$db->do("insert into initiativ (namn,startdatum,slutdatum) values(?,?,?)", {},
		$q->param('namn'),$q->param('start'),$q->param('slut'));

    my $lastid=$db->selectrow_array("select last_insert_id()", {});

	$db->do("insert into parameter (id,nyckel,varde) select ?,nyckel,forvalt from parameter_ordning",{},$lastid);
}
my $all = $db->selectall_arrayref("select * from initiativ", { Slice => {} });




print $q->start_html(-title=>'INI',
		     -style=>{-src=>'/~claes/ini.css'});
print $cb->meny();
print $cb->namn();

print $q->start_table();
print $q->Tr($q->td(['namn','startdatum','slutdatum','knapp']));
foreach my $in (@$all) {
    print $q->Tr($q->td([$in->{namn},$in->{startdatum},$in->{slutdatum},
$q->a({-href=>'parameter.pl?id='.$in->{id}},'Välj')]));
}
print $q->end_table();
if ($q->param('ny')) {
print $q->start_form();
print $q->start_ul();
print $q->li('NAMN<br> '.$q->textfield('namn'));
print $q->li('START<br> '.$q->textfield('start'));
print $q->li('SLUT<br> '.$q->textfield('slut').$q->submit('Spara'));
print $q->end_ul();
print $q->end_form();
} else {
print $q->a({-href=>'start.pl?ny=1'},'NYTT');
}
#print $q->Dump();


print $q->end_html();
