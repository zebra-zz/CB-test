
insert into anvandare (namn,losen) values('cb','apa');

select * from anvandare;

insert into initiativ (namn,startdatum,slutdatum) values ('Luft och vatten','2012-01-01','2012-12-31');

select * from initiativ;

insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'ANTAL_PAPPER',null,1);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'LAS_ELEKTRONSIK_FIL',null,2);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'ANTAL_ONLINE',null,3);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'ANTAL_TOTAL',null,4);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'FELMARGINAL',2,5);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'KONFIDENSGRAD',95,5);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'FORVANTAD_FELFREKVENS',50,5);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'STICKPROV',null,6);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'URVAL',null,7);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'LASFOLKBOKFORING',null,8);
insert into parameter_ordning (ord,nyckel,forvalt,steg) values (1,'AUTO',null,9);

insert into parameter (id,nyckel,varde) select 1,nyckel,forvalt from parameter_ordning;
-- insert into parameter (id,nyckel,varde) values (1,'ANTAL_PAPPER',5);
-- insert into parameter (id,nyckel,varde) values (1,'ANTAL_ONLINE',11);
-- insert into parameter (id,nyckel,varde) values (1,'ANTAL_TOTAL',16);
-- insert into parameter (id,nyckel,varde) values (1,'STICKPROV',5);

select * from parameter;
-- insert into stodforklaring (id,lopnummer,pnr,fornamn,efternamn,fodelseort,datumtxt,datum,typ)
-- values(1,1,'6607051478','C','B','Enköping','1/2 12','2012-02-01','ONLINE');

-- insert into stodforklaring (id,lopnummer,pnr,fornamn,efternamn,fodelseort,datumtxt,datum,typ)
-- values(1,11,'1212121212','Tolv','Tolvansson','STHLM','11/3 12','2012-03-11','ONLINE');

select * from stodforklaring;

-- insert into utvald (id,lopnummer,slump) values(1,1,rand());
-- insert into utvald (id,lopnummer,slump) values(1,2,rand());
-- insert into utvald (id,lopnummer,slump) values(1,3,rand());
-- insert into utvald (id,lopnummer,slump) values(1,4,rand());
-- insert into utvald (id,lopnummer,slump) values(1,5,rand());
-- insert into utvald (id,lopnummer,slump) values(1,6,rand());
-- insert into utvald (id,lopnummer,slump) values(1,7,rand());
-- insert into utvald (id,lopnummer,slump) values(1,8,rand());


-- insert into status (id,lopnummer) select 1,lopnummer from utvald order by slump limit 5;

select * from status;

insert into orsak (ord,godkand,godkand_txt,orsak,orsak_txt) values(1,0,'EJOK',1,'AUTO UNDERKÄND');
insert into orsak (ord,godkand,godkand_txt,orsak,orsak_txt) values(2,1,'OK',2,'AUTO GODKÄND');
insert into orsak (ord,godkand,godkand_txt,orsak,orsak_txt) values(3,1,'OK',3,'MANUELLT GODKÄND');
insert into orsak (ord,godkand,godkand_txt,orsak,orsak_txt) values(4,0,'EJOK',4,'MANUELLT UNDERKÄND');
