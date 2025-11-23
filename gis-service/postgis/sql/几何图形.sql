CREATE TABLE geometries (name varchar, geom geometry);
 
INSERT INTO geometries VALUES
  ('Point', 'POINT(0 0)'),
  ('Linestring', 'LINESTRING(0 0, 1 1, 2 1, 2 2)'),
  ('Polygon', 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'),
  ('PolygonWithHole', 'POLYGON((0 0, 10 0, 10 10, 0 10, 0 0),(1 1, 1 2, 2 2, 2 1, 1 1))'),
  ('Collection', 'GEOMETRYCOLLECTION(POINT(2 0),POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))');
  
 select * from geometries
 
 SELECT name, ST_AsText(geom) FROM geometries;
 
 select UpdateGeometrySRID('geometries','geom',0)
 
 select name,ST_GeometryType(geom),ST_NDims(geom),ST_SRID(geom) from geometries
 
 select ST_AsText(geom),ST_X(geom),ST_Y(geom),ST_Z(geom) from geometries where name='Point'
 
 select name,ST_AsText(geom) from nyc_subway_stations limit 1
 
 select name,ST_AsText(geom) from geometries where name='Linestring'
 
 select ST_IsClosed(geom),ST_IsSimple(geom),ST_Length(geom),ST_AsText(ST_StartPoint(geom)),ST_AsText(ST_EndPoint(geom)),ST_NPoints(geom) from geometries where name='Linestring'
 
 select name,ST_AsText(geom),geom from geometries where name like 'Polygon%'
 
 select name,ST_Area(geom),ST_NRings(geom),ST_AsText(ST_ExteriorRing(geom)),ST_AsText(ST_InteriorRingN(geom,1)),ST_Perimeter(geom) 
 from geometries where name like 'Polygon%'
 
 select name,ST_AsText(geom) from geometries where name='Collection'
 
 insert into geometries values
 ('MultiPoint','MultiPoint((0 0),(1 1),(2 2))'),
 ('MultiLineString','MultiLineString((0 1,1 2,0 3),(1 0,2 1,3 3))'),
 ('MultiPolygon','MultiPolygon(((3 3,4 4,5 3,4 2,3 3)),((7 7,8 8,9 6,7 7)))')
 
 select name,ST_AsText(geom) from geometries
 
 delete from geometries where name='MultiPoint'
 
 select name,ST_NumGeometries(geom),ST_Area(geom),ST_Length(geom) from geometries
 
 SELECT encode(ST_AsBinary(ST_GeometryFromText('LINESTRING(0 0,1 0)')),'hex');
 
 select UpdateGeometrySRID('geometries','geom',3857)
 
 select name,ST_AsGML(geom) from geometries
 select name,ST_AsKML(geom) from geometries_2
 select name,ST_AsGeoJSON(geom) from geometries
 select name,ST_AsSVG(geom) from geometries
 
 select ST_AsText(ST_GeometryFromText('Point(0 0 1)'))
 select ST_AsEWKT(ST_GeometryFromText('Point(0 0 1)'))
 
 select 0.9::text
 select 'Point(0 0)'::geometry
 select 'SRID=4326;Point(1 1)'::geometry
 
 select ST_Area(geom) from nyc_neighborhoods where name='West Village'
 
 select sum(ST_Area(geom))/4047 from nyc_census_blocks where boroname='Manhattan'
 
 select geom from nyc_census_blocks where ST_NumInteriorRings(ST_GeometryN(geom,1)) > 0
 
 select sum(ST_Length(geom)) from nyc_streets
 
 select ST_AsGeoJSON(geom) from nyc_neighborhoods where name='West Village'
 