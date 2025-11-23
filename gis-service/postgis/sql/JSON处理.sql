INSERT INTO test (info)
VALUES
   (
      '{ "customer": "Lily Bush", "items": {"product": "Diaper","qty": 24}}'
   ),
   (
      '{ "customer": "Josh William", "items": {"product": "Toy Car","qty": 1}}'
   ),
   (
      '{ "customer": "Mary Clark", "items": {"product": "Toy Train","qty": 2}}'
   );

select * from test

--  -> 按键返回 JSON 对象字段
select id,info->'items'->'product' from test
select '[12,22,32]'::json->2
--  ->> 按文本返回JSON对象字段
SELECT info ->> 'customer' AS customer FROM test
WHERE info -> 'items' ->> 'product' = 'Diaper'
select '[{"id":1,"name":"zs"},{"id":2,"name":"ls"}]'::json->>-1

select (info->'items'->>'qty')::integer from test
-- #> 按指定路径返回JSON对象字段
select info#>'{items}' from test
select info#>'{items,qty}' from test
select '{"data":[{"id":1,"num":10}]}'::json#>'{data,0,num}'

SELECT json_each(info) FROM test;
   
SELECT distinct json_object_keys(info) FROM test

SELECT json_typeof(info->'customer') FROM test limit 1;

select row_to_json(test) from test limit 1

select row_to_json(row(id,info)) from test limit 1
select row_to_json(t)
from (select id, info from test) AS t limit 1

select array_agg(id) from test

select array_agg(row_to_json(t))
from (select id, info from test) AS t

select array_to_json(array_agg(row_to_json(t)))
from (select id, info from test) AS t
where id=2

select array_to_json(array_agg(row_to_json(t)))
from (select name,type,ST_AsGeoJSON(geom) from stations) AS t
where 1=1 

with t3 as (select array_to_json((select array_agg(t2.row_to_json) from (select row_to_json(t) from 
		(select 'Feature' as "type",
 			ST_AsGeoJSON(geom)::json as "geometry",
 			json_build_object('name',name,'type',type) as "properties" from stations)
 		as t) as t2)));
select * from t3
select row_to_json(t) from (select 'FeatureCollection' as "type",t3.array_to_json as "features") as t,

 select array_to_json(
	 (select (array_agg(t2) from (select row_to_json(t) from 
		(select 'Feature' as "type",
 			ST_AsGeoJSON(geom)::json as "geometry",
 			json_build_object('name',name,'type',type) as "properties" from stations)
 		as t) as t2))
 )
 
 

 
 select row_to_json(t) from (select name,type from stations) as t

SELECT json_build_object('field1', 'field1_value', 'field2', 'field2_value')::json AS result;

WITH feature AS (
    SELECT 
        'Feature' AS "type",
        ST_AsGeoJSON(geom)::json AS "geometry",
        json_build_object('name', name, 'type', type) AS "properties"
    FROM stations
	WHERE name='济南市历城区盖家沟消防救援站'
),
geojson AS (
	SELECT
		'FeatureCollection' AS "type",
		features.array_to_json AS "features"
	FROM(
		SELECT array_to_json(array_agg(row_to_json(feature)))
		FROM feature) AS features
)
SELECT row_to_json(geojson) FROM geojson;



