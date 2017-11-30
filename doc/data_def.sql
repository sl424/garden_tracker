DROP TABLE IF EXISTS `affects`;
DROP TABLE IF EXISTS `planted`;
DROP TABLE IF EXISTS `seeds`;
DROP TABLE IF EXISTS `beds`;
DROP TABLE IF EXISTS `month`;
DROP TABLE IF EXISTS `family`;

-- create tables  and relations

create table beds (
	id int auto_increment primary key,
	name varchar(255) not null,
	area int not null
) ENGINE=InnoDB;

create table family (
	id int auto_increment primary key,
	name varchar(255) not null,
	alias varchar(255) not null
) ENGINE=InnoDB;


create table month (
	id int auto_increment primary key,
	name varchar(255) not null,
	avg_high int not null,
	avg_low int not null,
	water float not null
) ENGINE=InnoDB;

create table seeds (
	id int auto_increment primary key,
	fid int not null,
	name varchar(255) not null,
	do_best int not null,
	sunlight varchar(255) not null,
	water float not null,
	area int not null,
	foreign key (fid) references family(id),
	foreign key (do_best) references month(id)
) ENGINE=InnoDB;

create table planted (
	id int auto_increment primary key,
	sid int not null,
	bid int not null,
	date_planted date not null,
	unique key (sid, bid),
	foreign key (sid) references seeds(id),
	foreign key (bid) references beds(id)
) ENGINE=InnoDB;

create table affects (
	id int auto_increment primary key,
	mid int not null,
	bid int not null,
	sunlight int not null,
	unique key (mid, bid),
	foreign key (mid) references month(id),
	foreign key (bid) references beds(id)
) ENGINE=InnoDB;


-- populate family groups
insert into family(name, alias)
values
('Solanaceae', 'nightshade'),
('Fabaceae', 'legumes'),
('Brassicacae', 'mustard'),
('Cucurbitaceae', 'melon'),
('Liliaceae', 'onion');

insert into beds(name, area)
values
('alpha', '10000'),
('beta', '1222'),
('chi', '232323'),
('delta', '454545');

-- populate month data
insert into month(name, avg_high, avg_low, water)
values
('jan', '47', '33', '6.46'),
('feb', '51', '35', '5.71'),
('mar', '56', '37', '4.59'),
('apr', '60', '39', '3.98'),
('may', '67', '44', '2.30'),
('jun', '73', '48', '1.46'),
('jul', '81', '51', '0.57'),
('aug', '82', '51', '0.73'),
('sep', '77', '48', '1.47'),
('oct', '65', '41', '3.02'),
('nov', '52', '38', '6.94'),
('dec', '46', '33', '7.43');

insert into seeds(fid, name, do_best, sunlight, water, area)
values
((select id from family where name='Solanaceae'), 'tomato', 
	(select id from month where name='apr'),
	'8', '0.2', '432'),
((select id from family where name='Fabaceae'), 'pea', 
	(select id from month where name='may'),
	'6', '0.4', '9'),
((select id from family where name='Brassicacae'), 'brocalli', 
	(select id from month where name='jun'),
	'7', '0.5', '216'),
((select id from family where name='Cucurbitaceae'), 'cucumber', 
	(select id from month where name='jul'),
	'8', '0.3', '432'),
((select id from family where name='Liliaceae'), 'onion', 
	(select id from month where name='aug'),
	'4', '0.3', '15');



insert into planted(sid, bid, date_planted)
values
((select id from seeds where name='pea'), 
	(select id from beds where name='alpha'), '2017-4-12');

insert into affects (mid, bid, sunlight)
values
((select id from month where name='jan'), 
	(select id from beds where name='alpha'), '10');
