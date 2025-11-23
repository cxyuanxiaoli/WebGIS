select ST_Equals('Point(0 0)','MultiPoint(0 0)')

select * from nyc_neighborhoods where 
ST_Intersects(geom,(select geom from nyc_subway_stations where name='Broad St'))

select * from nyc_streets where 
ST_DWithin(geom,(select geom from nyc_subway_stations where name='Broad St'),10)

select boroname,name from nyc_neighborhoods where ST_Intersects(geom,(SELECT geom
FROM nyc_streets
WHERE name = 'Atlantic Commons'))

select * from nyc_streets where ST_Touches(geom,(SELECT geom
FROM nyc_streets
WHERE name = 'Atlantic Commons'))

select sum(popn_total) from nyc_census_blocks where ST_DWithin(geom,(SELECT geom
FROM nyc_streets
WHERE name = 'Atlantic Commons'),50)

select updateGeometrySRID('nyc_census_blocks','geom',26918)

select hoods.name as hoods,hoods.boroname,subway.name as subway 
from nyc_neighborhoods as hoods join nyc_subway_stations as subway 
on ST_Contains(hoods.geom,subway.geom) where subway.name='Broad St'

--曼哈顿行政区的各个社区的人口和种族构成是什么？
select  hoods.name,sum(census.popn_total) as pop,
100*sum(census.popn_white)/sum(census.popn_total) as white_percent,
100*sum(census.popn_black)/sum(census.popn_total) as black_percent
from nyc_census_blocks as census join nyc_neighborhoods as hoods
on ST_Intersects(hoods.geom,census.geom)  
where hoods.boroname='Manhattan' group by hoods.name
ORDER BY white_percent DESC

SELECT
  100.0 * Sum(popn_white) / Sum(popn_total) AS white_pct,
  100.0 * Sum(popn_black) / Sum(popn_total) AS black_pct,
  Sum(popn_total) AS popn_total
FROM nyc_census_blocks

SELECT DISTINCT routes FROM nyc_subway_stations;

SELECT DISTINCT routes
FROM nyc_subway_stations AS subways
WHERE strpos(subways.routes,'A') > 0;

select sum(census.popn_total) as total,
100*sum(census.popn_white)/sum(census.popn_total) as white,
100*sum(census.popn_black)/sum(census.popn_total) as black
from nyc_census_blocks as census join nyc_subway_stations as subway 
on ST_DWithin(census.geom,subway.geom,200) where strpos(subway.routes,'A')>0

CREATE TABLE subway_lines ( route char(1) );
INSERT INTO subway_lines (route) VALUES
  ('A'),('B'),('C'),('D'),('E'),('F'),('G'),
  ('J'),('L'),('M'),('N'),('Q'),('R'),('S'),
  ('Z'),('1'),('2'),('3'),('4'),('5'),('6'),
  ('7');

select subway.name,subway.routes,lines.* from nyc_subway_stations as subway
join subway_lines as lines on strpos(subway.routes,lines.route)>0 order by subway.name

select lines.route,sum(census.popn_total) as total,
100*sum(census.popn_white)/sum(census.popn_total) as white,
100*sum(census.popn_black)/sum(census.popn_total) as black
from nyc_census_blocks as census join nyc_subway_stations as subway 
on ST_DWithin(census.geom,subway.geom,200)
join subway_lines as lines on strpos(subway.routes,lines.route)>0
group by lines.route

--"小意大利（Little Italy）社区"有什么地铁站？它在哪些地铁线路上？
select subway.name,subway.routes from nyc_subway_stations as subway join nyc_neighborhoods as hoods
on ST_Contains(hoods.geom,subway.geom) where hoods.name='Little Italy'

--"6-train服务哪些社区?"
select distinct hoods.name from nyc_neighborhoods as hoods
join nyc_subway_stations as subway on ST_Contains(hoods.geom,subway.geom)
where strpos(subway.routes,'6')>0



