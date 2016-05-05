use nnegc_licensing;

show create table npp;
CREATE TABLE `npp` (
  `id` tinyint(2) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `full_name` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

show create table unit;
CREATE TABLE `unit` (
  `id` smallint(3) NOT NULL AUTO_INCREMENT,
  `short_name` varchar(20) DEFAULT NULL,
  `unit` tinyint(2) DEFAULT NULL,
  `fk_to_npp` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_to_npp` (`fk_to_npp`),
  CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`fk_to_npp`) REFERENCES `npp` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

alter table protocol add column `link` varchar(50) default null;

show create table protocol;
CREATE TABLE `protocol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(4) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `fk_to_unit` smallint(3) NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `link` varchar(50),
  PRIMARY KEY (`id`),
  KEY `fk_to_unit` (`fk_to_unit`),
  CONSTRAINT `protocol_ibfk_1` FOREIGN KEY (`fk_to_unit`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

show create table protocol_content;
CREATE TABLE `protocol_content` (
  `fk_to_protocol` int(11) NOT NULL,
  `paragraph` varchar(50) DEFAULT NULL,
  `content` text,
  `term` date DEFAULT NULL,
  `executive` text,
  `status` tinyint(1) DEFAULT '1',
  `state` text,
  KEY `fk_to_protocol` (`fk_to_protocol`),
  CONSTRAINT `protocol_content_ibfk_1` FOREIGN KEY (`fk_to_protocol`) REFERENCES `protocol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(4) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `number` varchar(50) DEFAULT NULL,
  `fk_to_unit` smallint(3) NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `link` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_to_unit` (`fk_to_unit`),
  CONSTRAINT `permission_ibfk_1` FOREIGN KEY (`fk_to_unit`) REFERENCES `unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

show create table permission_content;
CREATE TABLE `permission_content` (
  `fk_to_permission` int(11) NOT NULL,
  `paragraph` varchar(50) DEFAULT NULL,
  `content` text,
  `term` date DEFAULT NULL,
  `executive` smallint(3) unsigned DEFAULT NULL,
  `report` tinyint(1) DEFAULT '1',
  `section` varchar(10) DEFAULT NULL,
  `class` int(10) unsigned DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `state` text,
  KEY `fk_to_permission` (`fk_to_permission`),
  KEY `executive` (`executive`),
  KEY `class` (`class`),
  CONSTRAINT `permission_content_class` FOREIGN KEY (`class`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `permission_content_departments` FOREIGN KEY (`executive`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `permission_content_ibfk_1` FOREIGN KEY (`fk_to_permission`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `class` (
  `id` int(10) unsigned NOT NULL DEFAULT '0',
  `term` text,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `departments` (
  `id` smallint(3) unsigned NOT NULL DEFAULT '0',
  `name` varchar(50) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(45) NOT NULL DEFAULT 'admin',
  `password` char(32) NOT NULL,
  `is_active` tinyint(1) unsigned DEFAULT '1',
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

create table `defaults`(
	`id` smallint(4) unsigned not null auto_increment,
    `name` varchar(100),
    `value` varchar(200),
    primary key (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into defaults
set `name` = 'min_year', `value` = '2008';
insert into defaults
set `name` = 'max_year', `value` = 'next';
insert into defaults
set `name` = 'license_prefix', `value` = 'ОД № ';

select * from defaults;

select (select `value` from defaults where `name` = 'min_year') as min, (select `value` from defaults where `name` = 'max_year') as max;

update `permission_content` join `permission`
                    on `permission_content`.`fk_to_permission` = `permission`.`id`
                    set `permission_content`.`content` = 'content1',
                        `permission_content`.`term` = '2010-10-10',
                        `permission_content`.`executive` = '1',
                        `permission_content`.`report` = 1,
                        `permission_content`.`class` = 1,
                        `permission_content`.`section` = '1',
                        `permission_content`.`status` = '1',
                        `permission_content`.`state` = 'state1'
                    where `permission_content`.`paragraph` = '12'
                    and `permission`.`fk_to_unit` = 1 and `permission`.`year` = 2017;

show create table users;

show create table departments;

show create table permission;

select * from permission;
delete from permission where id = 2;

select * from permission_content;
alter table permission auto_increment = 1;
delete from permission;

insert into permission
set year = '2017', date = '2017-10-10', number = 'ОД № 000196/91/15', fk_to_unit = 1;

select * from protocol_content;
insert into protocol_content values 
(2, 9, 'content', "28.10.2010", 'Катя', 2, 'Збс');

update `protocol` set `link` = '\\uploads\\protocols\\2012\\2012-1.jpg' where `id` = 1 and `year` = 2012;


select * from protocol;


delete from protocol where id > 0;


alter table protocol auto_increment = 1;


select * from protocol_content;

select `protocol_content`.`status` as status, COUNT(`protocol_content`.`status`) as count from `protocol_content` join `protocol` on `protocol`.`id` = `protocol_content`.`fk_to_protocol` where 
`protocol`.`fk_to_unit` = 3 and `protocol`.`year` = 2017 and (`protocol_content`.`status` in (null, 0, 1, 2)) group by `protocol_content`.`status`;

select `protocol_content`.`status` as status, COUNT(`protocol_content`.`status`) as count from `protocol_content` join `protocol` on `protocol`.`id` = `protocol_content`.`fk_to_protocol` where 
`protocol`.`fk_to_unit` = 3 and `protocol`.`year` = 2017 and (`protocol_content`.`status` = 1) group by `protocol_content`.`status`;


update protocol set is_published = 1;


create table `users` (
	`id` smallint(5) unsigned not null auto_increment,
    `login` varchar(100) not null,
    `email` varchar(100) not null,
    `role` varchar(45) not null default 'admin',
    `password` char(32) not null,
    `is_active` tinyint(1) unsigned default '1',
    primary key (`id`)
) engine = InnoDB default charset = utf8;

alter table users add column `name` varchar(100);

insert into users
set login = 'admin',
	email = 'admin@your-site.com',
    role = 'admin',
    `password` = md5('rutjkfei9rjf940kd02emeatom');
    
    select * from users;

insert into users
set login = 'minchuk',
	email = 'admin@your-site.com',
    role = 'admin',
    `password` = md5('rutjkfei9rjf940kd02emeatom');

insert into users
set login = 'user',
	email = 'admin@your-site.com',
    role = 'user',
    `password` = md5('rutjkfei9rjf940kd02user');
    
    update users set name = 'Е.В. Минчук' where login = 'minchuk';
    update users set name = 'Администратор' where login = 'admin';
    update users set name = 'Пользователь' where login = 'user';



select* from unit;

create table years_range (
	`id` tinyint(1) unsigned not null ,
    `min` varchar(4),
    `max` varchar(4),
    PRIMARY KEY (`id`)
    
) engine = InnoDB default charset = utf8;

select * from years_range;

insert into years_range 
set id = 1, min = '2008', max = 'next';

update years_range
set min = '2007' where id = 1;

update years_range
set max = 'next' where id = 1;


select * from permission_content;

create table departments(
	`id` smallint(3) unsigned,
    `name` varchar(50),
    `full_name` varchar(100),
    `is_active` tinyint(1) unsigned default '1',
    primary key (`id`)
    
)engine = InnoDB default charset = utf8;

insert into departments
set id = 3, name = 'ВДЯУ', full_name = 'Исполнительная дирекция по качествую и управлению';

update departments set name = "Согласовывается"

select * from departments;

select * from permission;

insert into permission_content
set fk_to_permission = 1,
paragraph = '1',
content = 'content1',
term = '2010-10-10',
executive = 1,
class = 1,
status = 2,
state = 'state1';

select  `permission_content`.`paragraph`,
                        `permission_content`.`content`,
                        DATE_FORMAT(`permission_content`.`term`,'%d.%m.%Y') as term,
                        `permission_content`.`executive`,
                        `departments`.`name` as `department`,
                        `permission_content`.`report`,
                        `permission_content`.`section`,
                        `permission_content`.`class`,
                        `permission_content`.`status`,
                        `permission_content`.`state`
                from `permission_content` join `permission`
                on `permission_content`.`fk_to_permission` = `permission`.`id`
                join `departments` on `permission_content`.`executive` = `departments`.`id`
                where `permission`.`year` = 2017 and `permission`.`fk_to_unit` = 1;
                
create table `class` (
	`id` int unsigned,
    `term` text,
    primary key (`id`)
) engine = InnoDB default charset = utf8;

show create table class;

alter table `class` add column `is_active` tinyint(1) default 1;

insert into class
set id = 4,
term = 'alter table `class` add column `is_active` tinyint(1) default 1;alter table `class` add column `is_active` tinyint(1) default 1;alter table `class` add column `is_active` tinyint(1) default 1;alter table `class` add column `is_active` tinyint(1) default 1;alter table `class` add column `is_active` tinyint(1) default 1;alter table `class` add column `is_active` tinyint(1) default 1;alter table `class` add column `is_active` tinyint(1) default 1;';

select * from class;


select * from `departments` order by `name`;

select * from permission_content;



use nnegc_licensing;