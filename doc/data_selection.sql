-- find all the seeds that can grow in the month of 'aug'
select s.name from seeds s where s.water < 
(select m.water from month m where m.name='aug');

--find all the seeds that were planted in beds 'alpha'
select s.id, s.name from beds b 
inner join planted p on b.id = p.bid
inner join seeds s on s.id = p.sid
where b.name = 'alpha';

--find all the seeds that can be planted in 'apr'
select s.name from seeds s
inner join month m on s.month_id=m.id 
where m.name='apr'

--sum, min, max, count, 
--on f1.film_id=f2.film_id order by title desc;


