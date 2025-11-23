create extension postgis

create extension pgrouting

select postgis_full_version(),pgr_version()

ALTER TABLE shenzhen_roads
ADD COLUMN source INTEGER,
ADD COLUMN target INTEGER,
ADD COLUMN cost DOUBLE PRECISION,
ADD COLUMN reverse_cost DOUBLE PRECISION;

UPDATE shenzhen_roads
SET cost = ST_Length(geom), reverse_cost = -1
WHERE oneway = 'F';
UPDATE shenzhen_roads
SET reverse_cost = ST_Length(geom), cost = -1
WHERE oneway = 'T';
UPDATE shenzhen_roads
SET cost = ST_Length(geom), reverse_cost = ST_Length(geom)
WHERE oneway = 'B';

SELECT pgr_createTopology(
	'shenzhen_roads', 
	0.001,
	'geom',
	'gid',
	'source',
	'target'
);

create table res_1 as
SELECT * FROM pgr_dijkstra(
	'SELECT gid AS id,
		source, target,
		cost, reverse_cost
	FROM shenzhen_roads',
	48260, 8653,
	directed := FALSE
);
create table t as
select geom from shenzhen_roads roads join res_1 res on roads.gid = res.edge

create table res_2 as
SELECT * FROM pgr_dijkstra(
	'SELECT gid AS id,
		source, target,
		cost, reverse_cost
	FROM shenzhen_roads',
	Array[48260,9949], 8653,
	directed := FALSE
);

create table t2 as
select start_vid,ST_Union(geom) from shenzhen_roads roads join res_2 res 
on roads.gid = res.edge group by start_vid

select start_vid,end_vid,ST_Union(geom) from shenzhen_roads roads 
join (SELECT * FROM pgr_dijkstra(
	'SELECT gid AS id,
		source, target,
		cost, reverse_cost
	FROM shenzhen_roads',
	Array[53522,48260], 50797,
	directed := FALSE
)) res 
on roads.gid = res.edge group by start_vid,end_vid

select id,the_geom from shenzhen_roads_vertices_pgr 
order by ST_Distance(the_geom,ST_GeometryFromText('Point(12697103.5 2585587.5)',3857))
limit 1
