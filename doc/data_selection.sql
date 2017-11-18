--#1 Find all films with maximum length or minimum rental duration (compared to all other films). 
--#In other words let L be the maximum film length, and let R be the minimum rental duration in the table film. You need to find all films that have length L or duration R or both length L and duration R.
--#You just need to return attribute film id for this query. 

select film_id from film where 
film.length=(select max(film.length) from film)
or
film.rental_duration=(select min(film.rental_duration) from film);


--#2 We want to find out how many of each category of film ED CHASE has started in so return a table with category.name and the count
--#of the number of films that ED was in which were in that category order by the category name ascending (Your query should return every category even if ED has been in no films in that category).


select category.name, count(tmp1.category_id) from                             
(select fc.category_id, a.actor_id from actor a                                  
        inner join film_actor fa on a.actor_id=fa.actor_id                     
        inner join film f on fa.film_id=f.film_id                                             
        inner join film_category fc on fc.film_id=f.film_id) as tmp1 inner join category    
where category.category_id = tmp1.category_id group by category.name;

--#3 Find the first name, last name and total combined film length of Sci-Fi films for every actor
--#That is the result should list the names of all of the actors(even if an actor has not been in any Sci-Fi films)and the total length of Sci-Fi films they have been in.

select actor.first_name, actor.last_name, sum(tmp1.length) as total from                      
actor left join                                                                
    (select a.actor_id, f.length, f.film_id from actor a                       
        inner join film_actor fa on a.actor_id=fa.actor_id                                    
        inner join film f on fa.film_id=f.film_id                              
        inner join film_category fc on fc.film_id=f.film_id                    
        inner join category c on fc.category_id=c.category_id                  
        where c.name='Sci-Fi') as tmp1
        on tmp1.actor_id=actor.actor_id group by actor.actor_id;

--#4 Find the first name and last name of all actors who have never been in a Sci-Fi film


select first_name, last_name from 
(select actor.first_name, actor.last_name, 
sum(tmp1.length) as total from                      
actor left join                                                                
    (select a.actor_id, f.length, f.film_id from actor a                       
        inner join film_actor fa on a.actor_id=fa.actor_id                                    
        inner join film f on fa.film_id=f.film_id                              
        inner join film_category fc on fc.film_id=f.film_id                    
        inner join category c on fc.category_id=c.category_id                  
        where c.name='Sci-Fi') as tmp1
        on tmp1.actor_id=actor.actor_id group by actor.actor_id
 ) as tmp2 where total is NULL;

--#5 Find the film title of all films which feature both KIRSTEN PALTROW and WARREN NOLTE
--#Order the results by title, descending (use ORDER BY title DESC at the end of the query)
--#Warning, this is a tricky one and while the syntax is all things you know, you have to think oustide
--#the box a bit to figure out how to get a table that shows pairs of actors in movies

select title from 
(select f.film_id, f.title from film f 
inner join film_actor fa on f.film_id=fa.film_id 
inner join actor a on fa.actor_id=a.actor_id
where a.first_name='KIRSTEN' and a.last_name='PALTROW') as f1
inner join
(select f.film_id from film f 
inner join film_actor fa on f.film_id=fa.film_id 
inner join actor a on fa.actor_id=a.actor_id
where a.first_name='WARREN' and a.last_name='NOLTE') as f2
on f1.film_id=f2.film_id order by title desc;


