-- retrieve all seeds
SELECT s.id, s.name, f.name as fid, m.name as do_best, s.sunlight, s.water, s.area 
FROM seeds s INNER JOIN family f ON s.fid=f.id 
INNER JOIN month m ON s.do_best=m.id ;

-- retrieve seed by id
SELECT s.id, s.name, f.name as fid, m.name as do_best, s.sunlight, s.water, s.area 
FROM seeds s INNER JOIN family f ON s.fid=f.id 
INNER JOIN month m ON s.do_best=m.id 
WHERE s.id = [:seed_id];

-- filter all seeds by conditions
SELECT s.id, s.name, f.name as fid, m.name as do_best, s.sunlight, s.water, s.area 
FROM seeds s INNER JOIN family f ON s.fid=f.id 
INNER JOIN month m ON s.do_best=m.id 
WHERE name=[name_filter] AND do_best=[month filter] AND sunlight=[sun filter]
AND water=[water filter] AND area=[area filter] AND family=[family filter];

--add a seed
INSERT INTO seeds (`fid`,`name`,`do_best`,`sunlight`,`water`,`area`) 
values
([family name], [name], [do_best], [sunlight], [water], [area]);

--update a seed
UPDATE seeds SET fid=[fid], name=[name], do_best=[month], sunlight=[sun], 
water=[water], area=[area] WHERE id=[seed id]

-- retrieve a bed
SELECT * FROM beds b WHERE b.id=[bed_id];

--retieve all beds
SELECT * FROM beds b;

--retrieve all beds on conditions
SELECT * FROM beds b WHERE name=[name] AND area=[area];

--insert into bed
INSERT INTO beds (`name`,`area`) values ([name],[area]);

--update a bed
UPDATE beds SET name=[name], area=[area] WHERE id=[bed id];

--retrieve a month
SELECT * FROM month b WHERE b.id=[month id];

--retireve all months
SELECT * FROM month b;

--retrieve all on conditions
SELECT * FROM month b WHERE name=[name] AND avg_high=[high]
AND avg_low=[low] AND water=[water];

--insert into month
INSERT INTO month (`name`,`avg_high`, `avg_low`,`water`) values
([name], [avg_high], [avg_low], [water]);

--update a month
UPDATE month SET name=[name], avg_high=[high], avg_low=[low], water=[water] 
WHERE id=[id];

--retrieve a family
SELECT * FROM family b WHERE b.id=[family id]

--retrieve all family
SELECT * FROM family b

--retrieve family on conditons
SELECT * FROM family b WHERE name=[name] AND alias=[alias];

--insert to family
INSERT INTO family (`name`,`alias`) values ([name],[alias]);

--update a family
UPDATE family SET name=?, alias=? WHERE id=[family id];

--select affect by id
SELECT a.id, b.name as bid, m.name as mid, sunlight FROM affects a 
INNER JOIN beds b ON a.bid=b.id 
INNER JOIN month m ON a.mid=m.id
WHERE a.id=[affect id];

--retrieve all affects
SELECT a.id, b.name as bid, m.name as mid, sunlight FROM affects a
INNER JOIN beds b ON a.bid=b.id 
INNER JOIN month m ON a.mid=m.id;

--select affects on conditions
select * from (SELECT a.id, b.name as bid, m.name as mid, sunlight 
FROM affects a INNER JOIN beds b ON a.bid=b.id 
INNER JOIN month m ON a.mid=m.id) as tmp1
WHERE bid=[bed name] AND mid=[month name] AND sunlight=[sun];

--insert affect
INSERT INTO affects (`bid`,`mid`,`sunlight`) values ([bed],[month],[sunlight]);

--update effect id
UPDATE affects SET bid=[bed name], mid=[month name]  sunlight=[sunlight]
WHERE id=[affect id];

--select a planted
SELECT p.id, b.name as bid, s.name as sid, date_planted 
FROM planted p INNER JOIN beds b ON p.bid=b.id 
INNER JOIN seeds s ON p.sid=s.id 
WHERE p.id=[p_id];

--select all planted
SELECT p.id, b.name as bid, s.name as sid, date_planted 
FROM planted p INNER JOIN beds b ON p.bid=b.id 
INNER JOIN seeds s ON p.sid=s.id;

--select all on conditions
select * from (SELECT p.id, b.name as bid, s.name as sid, date_planted 
FROM planted p INNER JOIN beds b ON p.bid=b.id 
INNER JOIN seeds s ON p.sid=s.id) as tmp1
WHERE bid=[bed name] AND sid=[seed name] AND date_planted=[date_time];

--insert into planted
INSERT INTO planted (`bid`,`sid`,`date_planted`) values 
([bed], [seed],[date_time]);

--update planted
UPDATE planted SET bid=[bed], sid=[seed], date_planted=[date_time] 
WHERE id=[planted-id];

--retrieve all planning where sunlight is sufficient for the seed
SELECT a.id, b.name as bid, m.name as mid, s.name as seeds, f.name as family 
FROM affects a INNER JOIN beds b ON a.bid=b.id 
INNER JOIN month m ON a.mid=m.id 
INNER JOIN seeds s ON s.do_best=m.id 
INNER JOIN family f ON s.fid=f.id 
where s.sunlight <a.sunlight;

--retrieve all planning on conditions
select * from (SELECT a.id, b.name as bid, m.name as mid, 
s.name as seeds, f.name as family 
FROM affects a INNER JOIN beds b ON a.bid=b.id 
INNER JOIN month m ON a.mid=m.id 
INNER JOIN seeds s ON s.do_best=m.id 
INNER JOIN family f ON s.fid=f.id 
where s.sunlight < a.sunlight) as tmp1
WHERE bid=[bed name] AND mid=[month name] 
AND seeds=[seed name] AND family=[family name];





