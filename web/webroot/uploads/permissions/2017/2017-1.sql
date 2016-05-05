use nnegc_licensing_ppp;

select * from NPP;

select id from units where npp = 'ЮУАЭС' and unit = 3;

drop table units;

CREATE TABLE `NPP` (
  `id` tinyint(2) unsigned NOT NULL,
  `name` varchar(10) DEFAULT NULL,
  `full_name` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into NPP values 
(1, 'ЗАЭС', 'Запорожская АЭС'),
(2, 'РАЭС', 'Ривненская АЭС'),
(3, 'ХАЭС', 'Хмельницкая АЭС'),
(4, 'ЮУАЭС', 'Южно-Украинская АЭС');

CREATE TABLE `unit` (
  `id` tinyint(2) unsigned NOT NULL,
  `fk_to_npp` tinyint(2) unsigned NOT NULL,
  `unit` tinyint(2) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `c_unit_npp` (`fk_to_npp`),
  CONSTRAINT `c_unit_npp` FOREIGN KEY (`fk_to_npp`) REFERENCES `npp` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into unit values 
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 2, 1),
(8, 2, 2),
(9, 2, 3),
(10, 2, 4),
(11, 3, 1),
(12, 3, 2),
(13, 4, 1),
(14, 4, 2),
(15, 4, 3);

select npp.name, unit.unit, unit.id from unit join npp on unit.fk_to_npp = npp.id where unit.unit = 3 and unit.fk_to_npp = 2;


select * from unit;

create table `protocol` (
  `id` int unsigned not null,
  `year` smallint(4) unsigned not null,
  `fk_to_unit` tinyint(2) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `c_pm_unit` (`fk_to_unit`),
  CONSTRAINT `c_pm_unit` FOREIGN KEY (`fk_to_unit`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table protocol add column `date` date;
alter table protocol change `id` `id` int unsigned not null auto_increment;
alter table protocol_content drop foreign key `c_pmcontent_pm`;
alter table protocol_content add constraint `c_pmcontent_pm` foreign key (`fk_to_protocol`) references `protocol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
alter table protocol add column is_published tinyint(1) unsigned default 1;
alter table protocol add column is_active tinyint(1) unsigned default 0;


create table `protocol_content` (
`fk_to_protocol` int unsigned not null,
`paragraph` varchar(50),
`content` text,
`term` date,
`executive` text,
`status` tinyint(1) unsigned default 1,
`state` text,
primary key (`fk_to_protocol`),
constraint `c_pmcontent_pm` foreign key (`fk_to_protocol`) references `protocol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `pm2015` (
  `unit` tinyint(2) unsigned NOT NULL,
  `par` varchar(50) DEFAULT NULL,
  `content` text,
  `term` date DEFAULT NULL,
  `executive` varchar(100) DEFAULT NULL,
  `state` text,
  `execstate` tinyint(1) unsigned DEFAULT '1',
  KEY `c2015` (`unit`),
  CONSTRAINT `c2015` FOREIGN KEY (`unit`) REFERENCES `units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



update protocol_content join protocol on protocol_content.fk_to_protocol = protocol.id set protocol_content.paragraph = 6 where paragraph = 5 and protocol.fk_to_unit = 9 and protocol.year = 2017 ;

insert into protocol_content (fk_to_protocol, content, term, executive, `status`, state) values 
(397, 'Путин Питун4', '2015-10-01', 'Питун4', 1, 'Никогда не будет сделано 4');

insert into protocol_content values 
(397, 1, 'Путин Питун1', '2015-10-11', 'Питун1', 1, 'Никогда не будет сделано 1'), 
(397, 2, 'Путин Питун2', '2015-10-12', 'Питун2', 1, 'Никогда не будет сделано 2'),
(397, 3, 'Путин Питун3', '2015-10-09', 'Питун3', 1, 'Никогда не будет сделано 3');

update protocol_content set content = "1nmnsd,fm'sdfsddsf'sdfdsf\"sdfssdf'''<<''<<>><><div>...'''" where fk_to_protocol = 36 and paragraph = 1;

alter table protocol auto_increment = 1;

insert into `protocol_content` (`fk_to_protocol` ,`paragraph`) values ((select `id` from `protocol` where `fk_to_unit` = 1 and `year` = 2017), 34);

select * from protocol;

select * from protocol_content;

show create table protocol_content;
