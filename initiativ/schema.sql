drop table  if exists initiativ;
create table initiativ (
id int not null auto_increment primary key,
namn varchar(49),
startdatum date,
slutdatum date,
steg int default 1
);

drop table  if exists parameter;
create table parameter (
id int,
nyckel varchar(30),
varde decimal
);

drop table  if exists parameter_ordning;
create table parameter_ordning (
ord int,
nyckel varchar(30),
forvalt decimal,
steg int 
);

drop table if exists stodforklaring;
create table stodforklaring (
id int,
lopnummer int,
pnr varchar(20),
fornamn varchar(20),
efternamn varchar(20),
fodelseort varchar(20),
datumtxt varchar(20),
datum date,
typ varchar(10),
ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
primary key(id,lopnummer)
);

drop table if exists folkbokforing;
create table folkbokforing (
id int,
pnr2 varchar(20),
fornamn2 varchar(20),
efternamn2 varchar(20),
fodelseort2 varchar(20),
primary key(id,pnr2)
);

drop table if exists utvald;
create table utvald (
id int,
lopnummer int,
slump float,
primary key(id,lopnummer)
);

drop  table if exists status;
create table status (
id int,
lopnummer int,
typ2 varchar(10),
godkand int default 0,
orsak int default 1,	
primary key(id,lopnummer)
);

drop  table if exists orsak;
create table orsak (
ord int,
godkand int,
godkand_txt varchar(20),
orsak int,
orsak_txt varchar(20)
);

drop  table if exists anvandare;
create table anvandare (
id int not null auto_increment primary key,
namn varchar(20) unique key,
losen varchar(20),
sid varchar(30),
inloggad datetime,
initiativ int
);







