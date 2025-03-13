drop index nyc_census_blocks_geom_idx

SELECT blocks.blkid
FROM nyc_census_blocks blocks
JOIN nyc_subway_stations subways
ON ST_Contains(blocks.geom, subways.geom)
WHERE subways.name = 'Broad St';

CREATE INDEX nyc_census_blocks_geom_idx
ON nyc_census_blocks
USING GIST (geom);

select a.geom from nyc_neighborhoods a join nyc_neighborhoods b
on a.geom && b.geom where b.name='Bensonhurst'

SELECT Sum(popn_total)
FROM nyc_neighborhoods neighborhoods
JOIN nyc_census_blocks blocks
ON neighborhoods.geom && blocks.geom
WHERE neighborhoods.name = 'West Village';

SELECT Sum(popn_total)
FROM nyc_neighborhoods neighborhoods
JOIN nyc_census_blocks blocks
ON ST_Intersects(neighborhoods.geom,blocks.geom)
WHERE neighborhoods.name = 'West Village';

analyze nyc_census_blocks

vacuum analyze nyc_census_blocks

select ST_SRID(geom) from nyc_census_blocks limit 1

select srtext,proj4text from spatial_ref_sys where srid=26918

select ST_Equals(ST_GeomFromText('Point(0 0)',4326),ST_GeomFromText('Point(0 0)',26918))

select ST_GeomFromText('Point(0 0)',4326)=ST_GeomFromText('Point(0 0)',26918)

select ST_AsText(ST_Transform(geom,4326)) from nyc_subway_stations where name='Broad St'

select sum(ST_Length(geom)) from nyc_streets

select srtext from spatial_ref_sys where srid=2831

select sum(ST_Length(ST_Transform(geom,2831))) from nyc_streets

select ST_AsKML(geom) from nyc_subway_stations where name='Broad St'

SELECT ST_Distance(
  ST_GeometryFromText('POINT(-118.4079 33.9434)', 4326), -- Los Angeles (LAX)
  ST_GeometryFromText('POINT(2.5559 49.0083)', 4326)     -- Paris (CDG)
);

SELECT ST_Distance(
  ST_GeographyFromText('POINT(-118.4079 33.9434)'), -- Los Angeles (LAX)
  ST_GeographyFromText('POINT(2.5559 49.0083)')     -- Paris (CDG)
);

select ST_Distance(ST_GeographyFromText('LineString(-118.4079 33.9434, 2.5559 49.0083)'),
				  ST_GeographyFromText('Point(-22.6056 63.9850)'))
				  
SELECT ST_Distance(
  ST_GeometryFromText('Point(-118.4079 33.9434)'),  -- LAX
  ST_GeometryFromText('Point(139.733 35.567)'))     -- NRT (Tokyo/Narita)
    AS geometry_distance,
ST_Distance(
  ST_GeographyFromText('Point(-118.4079 33.9434)'), -- LAX
  ST_GeographyFromText('Point(139.733 35.567)'))    -- NRT (Tokyo/Narita)
    AS geography_distance;
	
create table nyc_subway_stations_geog as
select Geography(ST_Transform(geom,4326)) as geog,
name,routes from nyc_subway_stations

create index nyc_subway_stations_geog_gix
on nyc_subway_stations_geog using GIST (geog)

select ST_AsText(geog) from nyc_subway_stations_geog
select ST_AsGeoJSON(geog) from nyc_subway_stations_geog

create table airports(
	code varchar(3),
	geog Geography(Point)
)
insert into airports values('LAX', 'POINT(-118.4079 33.9434)'),
							('CDG', 'POINT(2.5559 49.0083)'),
							('KEF', 'POINT(-22.6056 63.9850)')
							
select ST_X(geog::geometry) as lon from airports
