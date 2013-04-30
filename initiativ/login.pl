#!/usr/bin/perl -w

use strict;
use Data::Dumper;
use CB;
my $cb=new CB;
my $q = $cb->q;
my $db = $cb->db;
my ($anvid,$id) = $cb->anvid();


$ENV{VERSIONER_PERL_PREFER_32_BIT}='yes';
my $fel=0;

my $cookie={};
if ($q->param('namn') || $q->param('losen')) {
    if (my $anvid = $db->selectrow_array("select id from anvandare where namn=? and losen=?", {},
					 $q->param('namn'),
					 $q->param('losen'))) {
	
	my $sid=substr(rand(),2);
	$db->do("update anvandare set sid=?, inloggad=now() where id=?", {}, $sid,$anvid);
	
	$cookie = $q->cookie(-name=>'INI',
			     -value=>$sid,
			     -expires=>'+4h',
			     -path=>'/'
);
	print $q->redirect(-uri=>'start.pl',-cookie=>$cookie);
    } else {
	$fel=1;
    } 
}
if ($q->param('loggaut')) {
    my $sid = $q->cookie('INI');
    $db->do("update anvandare set sid=null, inloggad=null where sid=?", {}, $sid);
    $cookie = $q->cookie(-name=>'INI',
			     -value=>'',
			     -expires=>'+4h',
			     -path=>'/');
} 
print $q->header(-cookie=>$cookie);



print $q->start_html(-title=>'INI',
		     -style=>{-src=>$cb->{css}});
print $cb->meny();
print $q->start_form(-action=>$q->url(-relative=>1));
print $q->ul($q->li([
		 $q->textfield('namn'),
		 $q->password_field('losen'),
		 $q->submit()]));
print $q->end_form();
print "ERROR" if $fel;
print $q->end_html();
print STDERR $q->pre(Dumper(\%ENV));
