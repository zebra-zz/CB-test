package CB;

use strict;
use CGI;
use CGI::Pretty;
use DBI;

sub new {
    my $self = {};
    bless $self;
    $self->{q} = new CGI;
    $self->{db} = DBI->connect('DBI:mysql:initiativ', 'root', '');
    return $self;
}

sub q() {
    my $self= shift;
    return $self->{q};
}
sub db() {
    my $self= shift;
    return $self->{db};
#    return DBI->connect('DBI:mysql:initiativ', 'root', '');
}
sub anvid {
    my $self= shift;
    my $kaka = $self->{q}->cookie('INI');
    my ($anvid,$id) = $self->db()->selectrow_array("select id,initiativ from anvandare where sid=?", {}, $kaka);
    $self->{id}=$id || 0;
    return ($anvid,$id);
}
sub namn {
    my $self= shift;
    my $namn = $self->db()->selectrow_array("select namn from initiativ where id=?", {}, $self->{id});
    return $self->{q}->h1($namn);
}
sub meny() { 
    my $self= shift;
    my $url = $self->{q}->url(-relative=>1);
    my $html = $self->{q}->start_ul({-id=>'nav'});
    foreach my $in ('login.pl?loggaut=1','start.pl','parameter.pl','stansa.pl','analys.pl','resultat.pl') {
	if ($in eq $url) {
	    $html.= $self->{q}->li($self->{q}->b($self->{q}->a({-href=>$in},$in)));
	} else {
	    $html.= $self->{q}->li($self->{q}->a({-href=>$in},$in));
	}
    }
     $html .= $self->{q}->end_ul();
    return $html;
}



1;
