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


print $q->start_html(-title=>'INI',
		     -style=>{-src=>$cb->{css}});
print $cb->meny();
print $cb->namn();
my $ant= $db->selectrow_array("select count(1) from status where id=? and godkand=1", {},$id);
print "ANTAL_GODKANDA $ant<br>\n";
my $tot= $db->selectrow_array("select count(1) from status where id=?", {},$id);
print "ANTAL_STOD $tot<br>\n";
my $totantal= $db->selectrow_array("select varde from parameter where id=? and nyckel='ANTAL_TOTAL'", {},$id);
my $res = ($tot) ? $totantal*$ant/$tot : 0;
print "TOTALT ANTAL GODKANDA  $res\n";
print $q->end_html();
