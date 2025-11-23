# PostGIS

## 创建空间数据库

1. 安装 postgis 插件
2. 新建数据库
3. 打开查询工具，输入`create extension postgis;`并执行，为数据库添加 postgis 扩展
4. 运行`select postgis_full_version();`确认扩展是否安装成功

## 加载空间数据

## 简单 sql 语句

简单查询语句结构：

```sql
SELECT some_columns FROM some_data_source WHERE some_condition;
```

使用一个**过滤器**来查询 nyc_neighborhoods 表：

```sql
SELECT name
FROM nyc_neighborhoods
WHERE boroname = 'Brooklyn';
```

对查询的结果应用一个函数：

```sql
SELECT char_length(name)
FROM nyc_neighborhoods
WHERE boroname = 'Brooklyn';
```

接受多行记录并返回单个结果的函数称为“**聚合**（aggregate）函数"

对查询结果应用聚合函数：

```sql
SELECT avg(char_length(name)), stddev(char_length(name))
FROM nyc_neighborhoods
WHERE boroname = 'Brooklyn';
```

**聚合函数**通常需要添加 GROUP BY 语句，以便基于一个或多个列对结果记录集进行分组求值

在整个结果集中对各个**子数据集**分组进行处理：

```sql
SELECT boroname, avg(char_length(name)), stddev(char_length(name))
FROM nyc_neighborhoods
GROUP BY boroname;
```

AS 用于为**表**或**列**指定**别名**

查询纽约市的总人口：

```sql
SELECT Sum(popn_total) AS population
FROM nyc_census_blocks;
```

## 几何图形

新建几何图形数据表，并添加数据

```sql
CREATE TABLE geometries (name varchar, geom geometry);

INSERT INTO geometries VALUES
  ('Point', 'POINT(0 0)'),
  ('Linestring', 'LINESTRING(0 0, 1 1, 2 1, 2 2)'),
  ('Polygon', 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'),
  ('PolygonWithHole', 'POLYGON((0 0, 10 0, 10 10, 0 10, 0 0),(1 1, 1 2, 2 2, 2 1, 1 1))'),
  ('Collection', 'GEOMETRYCOLLECTION(POINT(2 0),POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))');
```

查询表数据

```sql
 SELECT name, ST_AsText(geom) FROM geometries;
```

### 元数据

为了符合**Simple Features for SQL**（[SFSQL](https://link.zhihu.com/?target=https%3A//postgis.net/workshops/postgis-intro/glossary.html%23term-sfsql)）规范，[PostGIS](https://zhida.zhihu.com/search?content_id=101987557&content_type=Article&match_order=1&q=PostGIS&zhida_source=entity)提供了两张表用于追踪和报告数据库中的**几何图形**（这两张表中的内容相当于元数据）：

- 第一张表**[spatial_ref_sys](https://zhida.zhihu.com/search?content_id=101987557&content_type=Article&match_order=1&q=spatial_ref_sys&zhida_source=entity)** —— 定义了数据库已知的所有**空间参照系统**
- 第二张表（实际上是**视图**-view）**geometry_columns** —— 提供了数据库中所有空间数据表的描述信息

![Snipaste_2025-03-12_15-50-39](.\img\Snipaste_2025-03-12_15-50-39.png)

- **f_table_catalog**，**f_table_schema**，和**f_table_name**提供各个**几何图形**（geometry）的**要素表**（feature table）—— 即空间数据表 —— 的完全限定名称，分别是数据库名、模式名、空间数据表名
- **f_geometry_column**包含对应空间数据表中用于记录几何信息的属性列的列名
- **coord_dimension**定义几何图形的维度（2 维、3 维或 4 维）
- **srid**会引用自 spatial_ref_sys 表的空间参考标识符
- **type**列定义了几何图形的类型。比如"**点（Point）**"和"**线串（Linestring）**"等类型

通过查询该表，GIS 客户端和数据库可以确定检索数据时的预期内容，并可以执行任何必要的投影、处理、渲染而无需检查每个**几何图形**（geometry）—— 这些就是元数据所带来的作用。

**注意**：如果 nyc**数据库**的**表**没有指定 26918 的 srid，通过更新**表**很容易修复：

```sql
SELECT UpdateGeometrySRID('nyc_neighborhoods','geom',26918);
```

### 表示真实世界的对象

**Simple Features for SQL**（[SFSQL](https://link.zhihu.com/?target=https%3A//postgis.net/workshops/postgis-intro/glossary.html%23term-sfsql)）规范是 PostGIS 开发的原始指导标准，它定义了如何表示真实世界的对象

通过形成连续的图形并以固定的分辨率对其进行数字化，实现了对真实世界的合理表示

可以使用读取**几何图形**元数据的函数获取每个对象的基本信息：

- **ST_GeometryType(geometry)** —— 返回几何图形的类型
- **ST_NDims(geometry)** —— 返回几何图形的维数
- **ST_SRID(geometry)** —— 返回几何图形的空间参考标识码

```sql
SELECT name, ST_GeometryType(geom), ST_NDims(geom), ST_SRID(geom)
FROM geometries;
```

<img src=".\img\Snipaste_2025-03-12_16-04-05.png" alt="Snipaste_2025-03-12_16-04-05" style="zoom: 67%;" />

#### 点(Point)

```sql
SELECT ST_AsText(geom) FROM geometries WHERE name = 'Point';
```

POINT(0 0)

针对**点**的一些特定**空间函数**包括：

- **ST_X(geometry)** —— 返回 X 坐标
- **ST_Y(geometry)** —— 返回 Y 坐标
- **ST_Z(geometry)** —— 返回 Z 坐标
- **ST_M(geometry)** —— 返回 M 信息

读取一个**点**图形的坐标值：

```sql
SELECT ST_X(geom), ST_Y(geom)
FROM geometries
WHERE name = 'Point';
```

#### 线串(LineString)

```sql
SELECT ST_AsText(geom) FROM geometries WHERE name = 'Linestring';
```

LINESTRING(0 0,1 1,2 1,2 2)

如果**线串**的起始点和结束点是同一个**点**，则称其是**闭合的**（closed），可以使用**[ST_IsClosed](https://link.zhihu.com/?target=http%3A//postgis.net/docs/manual-3.0/ST_IsClosed.html)**函数进行测试。

如果**线串**不与自身交叉或接触（如果**线串**是闭合的，则排除结束点），则称其是**简单的**（simple），可以使用**[ST_IsSimple](https://link.zhihu.com/?target=http%3A//postgis.net/docs/manual-3.0/ST_IsSimple.html)**函数进行测试。

**线串**既可以是**闭合的**，也可以是**简单的**。

用于处理**线串**的一些特定**空间函数**包括：

- **ST_Length(geometry)** —— 返回线串的长度
- **ST_StartPoint(geometry)** —— 将线串的第一个坐标作为点返回
- **ST_EndPoint(geometry）** —— 将线串的最后一个坐标作为点返回
- **ST_NPoints(geometry)** —— 返回线串的坐标数量

**线串**的长度为：

```sql
SELECT ST_Length(geom)
FROM geometries
WHERE name = 'Linestring';
```

#### 多边形(Polygon)

```sql
SELECT ST_AsText(geom) FROM geometries WHERE name LIKE 'Polygon%';
```

POLYGON((0 0,1 0,1 1,0 1,0 0)) POLYGON((0 0,10 0,10 10,0 10,0 0),(1 1,1 2,2 2,2 1,1 1))

SQL 中，使用"**%**"符号和 LIKE 运算符进行单字符或多字符匹配

**多边形**（Polygon）是区域的表示形式。**多边形**的外部边界由一个**环**（Ring）表示（**外环**），这个**环**是一个**线串**，如上面定义的，它既是闭合的，又是简单的。**多边形**中的**孔**（hole）也由**环**表示（**内环**）

**多边形**图形的一些特定**空间函数**包括：

- **ST_Area(geometry)** —— 返回多边形的面积
- **ST_NRings(geometry)** —— 返回多边形中环的数量（通常为 1 个，其他是孔）
- **ST_ExteriorRing(geometry)** —— 以线串的形式返回多边形最外面的环
- **ST_InteriorRingN(geometry, n)** —— 以线串形式返回指定的内部环
- **ST_Perimeter(geometry)** —— 返回所有环的长度

使用**空间函数**计算**多边形**的面积：

```sql
SELECT name, ST_Area(geom)
FROM geometries
WHERE name LIKE 'Polygon%';
```

#### 图形集合(Collection)

```sql
SELECT name, ST_AsText(geom) FROM geometries WHERE name = 'Collection';
```

GEOMETRYCOLLECTION(POINT(2 0),POLYGON((0 0,1 0,1 1,0 1,0 0)))

有四种图形**集合**（Collection）类型，它们将多个简单几何图形组合为**图形集合**：

- **MultiPoint** —— 点集合
- **MultiLineString** —— 线串集合
- **MultiPolygon** —— 多边形集合
- **GeometryCollection** —— 由任意几何图形（包括其他 GeometryCollection）组成的异构集合

<img src=".\img\Snipaste_2025-03-12_16-56-41.png" alt="Snipaste_2025-03-12_16-56-41" style="zoom:67%;" />

用于处理**图形集合**的一些特定**空间函数**：

- **ST_NumGeometries(geometry)** —— 返回集合中的组成部分的数量
- **ST_GeometryN(geometry, n)** —— 返回集合中指定的组成部分
- **ST_Area(geometry)** —— 返回集合中所有多边形组成部分的总面积
- **ST_Length(geometry)** —— 返回所有线段组成部分的总长度

#### 几何图形的输入与输出

PostGIS 支持以多种格式进行**几何图形**的输入和输出

1. Well-known text（[WKT](https://link.zhihu.com/?target=https%3A//postgis.net/workshops/postgis-intro/glossary.html%23term-wkt)）

   - **ST_GeomFromText(text, srid)** —— 返回 geometry

   - **ST_AsText(geometry)** —— 返回 text

   - **ST_AsEWKT(geometry)** —— 返回 text

2. Well-known binary（WKB）

   - **ST_GeomFromWKB(bytea)** —— 返回 geometry

   - **ST_AsBinary(geometry)** —— 返回 bytea

   - **ST_AsEWKB(geometry)** —— 返回 bytea

3. Geographic Mark-up Language（GML）

   - **ST_GeomFromGML(text)** —— 返回 geometry

   - **ST_ASGML(geometry)** —— 返回 text

4. Keyhole Mark-up Language（KML）

   - **ST_GeomFromKML(text)** —— 返回 geometry

   - **ST_ASKML(geometry)** —— 返回 text

5. GeoJson

   - **ST_AsGeoJSON(geometry)** —— 返回 text

6. Scalable Vector Graphics(SVG）

   - **ST_AsSVG(geometry)** —— 返回 text

以下**SQL 查询**展示了一个**WKB**表示形式的示例（将**二进制**输出转换为 ASCII 格式以进行打印时，需要调用**encode()**）：

```sql
SELECT encode(ST_AsBinary(ST_GeometryFromText('LINESTRING(0 0,1 0)')),'hex');
```

由于 WKT 和 WKB 是在 SFSQL 规范中定义的，因此它们不能处理 3 维或 4 维的几何图形。对于这些情况，PostGIS 定义了**Extended Well Known Text(EWKT)**和**Extended Well Known Binary(EWKB)**格式以用于处理 3 维或 4 维的几何图形

它们提供了与 WKT 和 WKB 相同的格式化功能，并且是在增加了**维度**的情况下

```sql
select ST_AsText(ST_GeometryFromText('Point(0 0 1)'))
```

POINT Z (0 0 1)

```sql
select ST_AsEWKT(ST_GeometryFromText('Point(0 0 1)'))
```

POINT(0 0 1)

PostGIS 的文本输入程序在使用方面是自由的。它可以使用：

- 十六进制编码的 EWKB
- 扩展的 EWKT
- ISO 标准的 WKT

但是在输出端，**ST_AsText()**只返回**ISO 标准**的 WKT 格式

除了**ST_GeometryFromText**函数之外，还有许多其他方式可以从 WKT 或类似的格式输入中创建几何图形：

```sql
-- Using ST_GeomFromText with the SRID parameter
SELECT ST_GeomFromText('POINT(2 2)',4326);

-- Using ST_GeomFromText without the SRID parameter
SELECT ST_SetSRID(ST_GeomFromText('POINT(2 2)'),4326);

-- Using a ST_Make* function
SELECT ST_SetSRID(ST_MakePoint(2, 2), 4326);

-- Using PostgreSQL casting syntax and ISO WKT
SELECT ST_SetSRID('POINT(2 2)'::geometry, 4326);

-- Using PostgreSQL casting syntax and extended WKT
SELECT 'SRID=4326;POINT(2 2)'::geometry;
```

#### 从文本转换

PostgreSQL 包含一个简短形式的语法，允许数据从一种类型转换到另一种类型，即类型转换语法：

```sql
olddata::newtype
```

以下 SQL 语句将一个 WKT 字符串转换成一个**几何图形**（geometry）：

```sql
SELECT 'POINT(0 0)'::geometry;
```

关于使用类型转换语法创建**几何图形**，需要注意一点：除非指定 SRID，否则将得到一个包含未知 SRID 的**几何图形**，可以使用 EWKT 形式指定 SRID，该形式可以在前面包含一个 SRID：

```sql
SELECT 'SRID=4326;POINT(0 0)'::geometry;
```

## 空间关系

### 空间相等

**ST_Equals(geometry A, geometry B)**用于测试两个图形的空间相等性

如果两个**相同类型**的几何图形具有**相同的x、y坐标值**，即如果第二个图形与第一个图形的空间形状与位置相等（空间相等性），则ST_Equals()返回TRUE

### 空间相交

**ST_Intersects**、**ST_Crosses**和**ST_Overlaps**都用于测试几何图形内部是否相交

1. **ST_Intersects(geometry A, geometry B)**

   <img src=".\img\Snipaste_2025-03-12_22-08-49.png" alt="Snipaste_2025-03-12_22-08-49" style="zoom: 33%;" />

   如果两个图形有相同的空间部分，即如果它们的边界或内部相交，则ST_Intersects(geometry A, geometry B)返回TRUE

   ST_Intersects()方法的对立方法是**ST_Disjoint(geometry A, geometry B)**。

   如果两个几何图形没有相交的部分，则它们不相交，反之亦然。

   事实上测试"not intersect"（!ST_Intersects）通常比测试"disjoint"（ST_Disjoint）更有效，因为intersect测试会自动使用**空间索引**。

2. **ST_Crosses(geometry A, geometry B)**

   <img src=".\img\Snipaste_2025-03-12_22-08-59.png" alt="Snipaste_2025-03-12_22-08-59" style="zoom:33%;" />

   对于multipoint/polygon、multipoint/linestring、linestring/linestring、linestring/polygon和linestring/multipolygon的比较，如果相交生成的几何图形的维度小于两个源几何图形的最大维度，且相交集位于两个源几何图形的内部，则**ST_Crosses(geometry A, geometry B)**将返回TRUE（其实就是判断两个几何图形是否交叉）

3. **ST_Overlaps(geometry A, geometry B)**

   <img src=".\img\Snipaste_2025-03-12_22-09-06.png" alt="Snipaste_2025-03-12_22-09-06" style="zoom:38%;" />
   
   **ST_Overlaps(geometry A, geometry B)**比较两个相同维度的几何图形，如果它们的结果集与两个源几何图形都不同但具有相同维度，则返回TRUE（其实就是判断两个几何图形是否叠置）

### 空间接触

**ST_Touches(geometry A, geometry B)**测试两个几何图形是否在它们的边界上接触，但在它们的内部不相交

<img src=".\img\Snipaste_2025-03-12_22-17-17.png" alt="Snipaste_2025-03-12_22-17-17" style="zoom:38%;" />

如果两个几何图形的**边界相交**，或者只有一个几何图形的内部与另一个几何图形的边界相交，则**ST_Touches(geometry A, geometry B)**将返回TRUE

### 空间包含

**ST_Within(geometry A, geometry B)**和**ST_Contains(geometry A, geometry B)**测试一个几何图形是否完全位于另一个几何图形内

如果第一个几何图形完全位于第二个几何图形内，则ST_Within(geometry A, geometry B)返回TRUE，ST_Within()测试的结果与ST_Contains()完全相反。

如果第二个几何图形B完全包含在第一个几何图形A内，则ST_Contains(geometry A, geometry B)返回TRUE

### 空间距离

**ST_Distance(geometry A, geometry B)**计算两个几何图形之间的最短距离，并将其作为浮点数返回

为了测试两个几何图形之间的距离是否在某个范围之内，**ST_DWithin(geometry A, geometry B，dis)**函数提供了一个基于索引加速的功能

## 空间连接

**空间连接**（spatial joins）是**空间数据库**的主要组成部分，它们允许你使用**空间关系**作为**连接键**（join key）来连接来自不同**数据表**的信息。我们认为“标准GIS分析”的大部分内容可以表示为空间连接

任何在两个表之间提供true/false关系的函数都可以用来驱动**空间连接**，但最常用的函数是：ST_Intersects、ST_Contains和ST_DWithin

### 连接和汇总

**JOIN**和**GROUP BY**的组合支持通常在GIS系统中的某些分析

例如："**曼哈顿行政区的各个社区的人口和种族构成是什么？**"，这个问题将人口普查中的人口信息与社区的几何信息结合在一起，社区信息只限制在曼哈顿的一个行政区中

```sql
SELECT
  neighborhoods.name AS neighborhood_name,
  Sum(census.popn_total) AS population,
  100.0 * Sum(census.popn_white) / Sum(census.popn_total) AS white_pct,
  100.0 * Sum(census.popn_black) / Sum(census.popn_total) AS black_pct
FROM nyc_neighborhoods AS neighborhoods
JOIN nyc_census_blocks AS census
ON ST_Intersects(neighborhoods.geom, census.geom)
WHERE neighborhoods.boroname = 'Manhattan'
GROUP BY neighborhoods.name
ORDER BY white_pct DESC;
```

### 高级连接

**问题：**地铁的服务区域的种族构成？

首先查询单条线路种族构成，计算一下**距A-train线200米以内的种族构成**：

```sql
SELECT
  100.0 * Sum(popn_white) / Sum(popn_total) AS white_pct,
  100.0 * Sum(popn_black) / Sum(popn_total) AS black_pct,
  Sum(popn_total) AS popn_total
FROM nyc_census_blocks AS census
JOIN nyc_subway_stations AS subways
ON ST_DWithin(census.geom, subways.geom, 200)
WHERE strpos(subways.routes,'A') > 0;
```

查询中添加另一个连接，以便可以同时计算多条地铁线路的构成。要做到这一点，需要创建一个新的表，遍历想要汇总的所有行

```sql
CREATE TABLE subway_lines ( route char(1) );
INSERT INTO subway_lines (route) VALUES
  ('A'),('B'),('C'),('D'),('E'),('F'),('G'),
  ('J'),('L'),('M'),('N'),('Q'),('R'),('S'),
  ('Z'),('1'),('2'),('3'),('4'),('5'),('6'),
  ('7');
```

将subway lines连接到原始查询中

```sql
SELECT
  lines.route,
  100.0 * Sum(popn_white) / Sum(popn_total) AS white_pct,
  100.0 * Sum(popn_black) / Sum(popn_total) AS black_pct,
  Sum(popn_total) AS popn_total
FROM nyc_census_blocks AS census
JOIN nyc_subway_stations AS subways
ON ST_DWithin(census.geom, subways.geom, 200)
JOIN subway_lines AS lines
ON strpos(subways.routes, lines.route) > 0
GROUP BY lines.route
ORDER BY black_pct DESC;
```

## 空间索引

**空间索引**是空间数据库的三个关键特性之一。**空间索引**使得使用空间数据库存储大型数据集成为可能。在没有**空间索引**的情况下，对要素的任何搜索都需要对数据库中的每条记录进行"顺序扫描"。**索引**通过将数据组织到**搜索树**中来加快搜索速度，**搜索树**可以快速遍历以查找特定记录

加载nyc_census_blocks表时，**pgShapeLoader**会自动创建名为nyc_census_blocks_geom_idx的**空间索引**

删除索引：

```sql
DROP INDEX nyc_census_blocks_geom_idx;
```

重新添加**空间索引**：

```sql
CREATE INDEX nyc_census_blocks_geom_idx
ON nyc_census_blocks
USING GIST (geom);
```

**USING GIST**子句告诉PostgreSQL在构建索引时使用generic index structure（**GIST-通用索引结构**）

### 空间索引工作原理

标准数据库索引基于某个列的值创建层次结构树。**空间索引**略有不同-它们不能索引几何要素本身，而是索引几何要素的边界框。空间数据库回答"**哪些直线与黄星相交**"这一问题使用的方法是，首先使用**空间索引**（速度非常快）判断"**哪些直线的边界框与黄星边界框相交**"，然后仅对第一次返回的几何要素进行"**哪些直线与黄星相交**"的精确计算

对于一个大的数据表来说，这种先计算出近似结果，然后进行精确测试的"两遍"机制可以从根本上减少计算量。（这种思想就是**粗调和精调**的思想，就像显微镜一样有粗粒度的调整和细粒度的调整。很多事物都涉及到这个思想，它的作用就是减少了耗费的代价）

PostGIS和Oracle Spatial都具有相同的"**R-Tree**"空间索引结构。R-Tree将数据分解为**矩形**（rectangle）、**子矩形**（sub-rectangle）和**子-子矩形**（sub-sub rectangle）等。它是一种可自动处理可变数据的密度和对象大小的自调优（self-tuning）索引结构

### 纯索引查询

PostGIS中最常用的函数（ST_Contains、ST_Intersects、[ST_DWithin](https://zhida.zhihu.com/search?content_id=102086917&content_type=Article&match_order=1&q=ST_DWithin&zhida_source=entity)等）都包含**自动索引过滤器**。但有些函数（如ST_Relate）不包括**索引过滤器**

要使用索引执行边界框搜索（即**纯索引查询**-Index only Query-没有过滤器），需要使用"**&&**"运算符。对于几何图形，&&运算符表示"边界框重叠或接触"（纯索引查询）

使用&&操作符的**纯索引查询**如下所示：

```sql
SELECT Sum(popn_total)
FROM nyc_neighborhoods neighborhoods
JOIN nyc_census_blocks blocks
ON neighborhoods.geom && blocks.geom
WHERE neighborhoods.name = 'West Village';
```

### 分析

PostgreSQL查询规划器（query planner）智能地选择何时使用或不使用**空间索引**来计算查询。与直觉相反，执行**空间索引**搜索并不总是更快：如果搜索将返回表中的每条记录，则遍历索引树以获取每条记录实际上比从一开始线性读取整个表要慢

为了弄清楚要处理的数据的大概内容（读取表的一小部分信息，而不是读取表的大部分信息），PostgreSQL保存每个索引列中数据分布的**统计信息**。默认情况下，PostgreSQL定期收集统计信息。但是，如果在短时间内更改了表的构成，则统计数据将不会是最新的。为确保统计信息与表内容匹配，明智的做法是在表中加载和删除大容量数据后手动运行**ANALYZE命令**。这将强制统计系统收集所有索引列的统计信息

ANALYZE命令要求PostgreSQL遍历该表并更新用于查询操作而估算的内部统计信息

```sql
ANALYZE nyc_census_blocks;
```

### 清理

值得强调的是，仅仅创建**空间索引**不足以让PostgreSQL有效地使用它。每当创建新索引或对表大量更新、插入或删除后，都必须执行**清理（VACUUMing）**。**VACUUM**命令要求PostgreSQL回收表页面中因记录的更新或删除而留下的任何未使用的空间。**清理**对于数据库的高效运行非常关键，因此，PostgreSQL提供了一个“**自动清理**（autovacuum）"选项

默认情况下，**自动清理机制**会根据活动级别确定的合理时间间隔自动清理（恢复空间）和分析（更新统计信息）。虽然这对于高度事务性的数据库是必不可少的功能，但在添加索引或大容量数据之后等待自动清理运行是不明智的，如果执行大批量更新，则应该手动运行VACUUM命令

根据需要，可以单独执行清理和分析。发出VACUUM命令不会更新数据库统计信息；同样，执行ANALYZE命令也不会清理未使用的表空间。这两个命令都可以针对整个数据库、单个表或单个列运行

```sql
VACUUM ANALYZE nyc_census_blocks;
```

## 投影数据

我们在加载纽约数据时"邂逅"了投影。（回想一下令人讨厌的SRID 26918）。但是，有时需要在空间参考系统之间进行变换和重新投影。**PostGIS**包含更改数据投影（重投影）的功能，即使用**ST_Transform(geometry, srid)**函数就可以实现重投影。另外，为了查看和设置几何图形的空间参照标识符，PostGIS提供了**ST_SRID(geometry）**和**ST_SetSRID(geometry，SRID）**函数

可以使用ST_SRID(geometry)函数确认数据的SRID：

```sql
SELECT ST_SRID(geom) FROM nyc_streets LIMIT 1;
```

投影26918的定义包含在spatial_ref_sys表中。有两个定义，"well-known text"（[WKT](https://link.zhihu.com/?target=https%3A//postgis.net/workshops/postgis-intro/glossary.html%23term-wkt)）定义在**srtext**列中，"proj.4"格式定义在**proj4text**列

```sql
SELECT srtext,proj4text FROM spatial_ref_sys WHERE srid = 26918
```

实际上，srtext和proj4text列都很重要：srtext列由GeoServer、uDig和FME等外部程序使用；proj4text列由PostGIS的内部程序使用

### 比较数据

坐标和SRID（严谨的说应该是空间参考系统）一起定义了地球上的一个位置。没有SRID，坐标只是一个抽象而没有实际意义的概念。“**笛卡尔**”坐标平面被定义为放置在地球表面的“平面”坐标系。由于PostGIS函数在这样的坐标系统上工作，因此关于两个几何图形的比较的操作都要基于同一SRID

如果输入具有不同SRID的几何图形，则会得到错误：

```sql
SELECT ST_Equals(
         ST_GeomFromText('POINT(0 0)', 4326),
         ST_GeomFromText('POINT(0 0)', 26918)
         );
```

**空间索引**是基于存储的几何图形的SRID构建的。如果在不同的SRID中进行比较，则通常不使用**空间索引**。最佳做法是为数据库中的所有表选择一个SRID。仅在向外部程序读取或写入数据时使用转换函数将数据转换为基于指定SRID的数据

### 转换数据

若要将数据从一种SRID转换为另一种SRID，必须首先验证几何图形是否具有有效的SRID

将"Broad St（宽街）"地铁站的坐标转换为**地理坐标**：

```sql
SELECT ST_AsText(ST_Transform(geom,4326))
FROM nyc_subway_stations
WHERE name = 'Broad St';
```

POINT(-74.01067146887341 40.70710481558761)

如果加载数据或创建新几何图形而未指定SRID，则SRID的值将为0。如果知道坐标的SRID是什么，则可以使用**ST_SetSRID()**对几何图形进行SRID设置。然后，你将能把几何图形的现有坐标系统转换为其他坐标系统

```sql
SELECT ST_AsText(
 ST_Transform(ST_SetSRID(geom,26918),4326)
)
FROM geometries;
```

**Broad St地铁站点的KML表示是什么？**

```sql
SELECT ST_AsKML(geom) FROM nyc_subway_stations WHERE name = 'Broad St';
```

<Point><coordinates>-74.01067146887341,40.70710481558761</coordinates></Point>

KML标准规定所有坐标都必须是**地理坐标**（实际上是EPSG: 4326），所以ST_AsKML()函数会自动进行坐标转换

## 地理

坐标为"**地理（geographics）**"形式或者说是" 纬度（latitude）/经度（longitude）"形式的数据非常常见。**地理坐标**并不表示平面上与原点的线性距离，相反，这些[球坐标](https://zhida.zhihu.com/search?content_id=102168100&content_type=Article&match_order=1&q=球坐标&zhida_source=entity)描述了地球上的角坐标。在球坐标中，点由该点与参考子午线（经度）的旋转角度和该点与赤道的角度（纬度）指定

你可以将**地理坐标**看作近似的笛卡尔平面坐标，并继续进行空间计算，然而，关于距离、长度和面积的测量将会是毫无意义的。由于球坐标测量角度距离，因此单位以"**度**"表示。此外，索引和真/假测试（如**相交**和**包含**）可能会变得非常错误，因为越与极点或国际日期线接近的区域，点与点之间的距离变得越大

使用标准的[PostGIS](https://zhida.zhihu.com/search?content_id=102168100&content_type=Article&match_order=1&q=PostGIS&zhida_source=entity)笛卡尔平面坐标系空间函数ST_Distance(geometry, geometry)计算**洛杉矶**和**巴黎**之间的距离。请注意，[SRID 4326](https://zhida.zhihu.com/search?content_id=102168100&content_type=Article&match_order=1&q=SRID+4326&zhida_source=entity)声明了地理空间参考系统

```sql
SELECT ST_Distance(
  ST_GeometryFromText('POINT(-118.4079 33.9434)', 4326), -- Los Angeles (LAX)
  ST_GeometryFromText('POINT(2.5559 49.0083)', 4326)     -- Paris (CDG)
);
```

121.89828597010705

在地球球体上，1度对应的地球实际距离的大小是变化的。当远离赤道时，它会变得更小，当越接近两极时，地球上的经线相互之间越来越接近。因此，121度的距离并不意味着什么，这是一个没有意义的数字。为了计算出真实的距离，我们不能把**地理坐标**近似的看成笛卡尔平面坐标，而应该把它们看成是球坐标。我们必须把两点之间的距离作为球面上的真实路径来测量——**大圆**（大圆被定义为过球心的平面和球面的交线）的一部分

从1.5版开始，PostGIS通过**地理（geography）数据类型**提供此功能。不同的空间数据库有不同的"处理地理"的方法

关于上面的测量应该使用geography而不是geometry类型。也就是说使用geography这种数据类型时，PostGIS的内部计算是基于实际地球球体来计算的；而使用geometry这种数据类型时，PostGIS的内部计算是基于平面来计算的

再次尝试测量**洛杉矶**和**巴黎**之间的距离，使用**ST_GeographyFromText(text)**函数，而不是**ST_GeometryFromText()**。

```sql
SELECT ST_Distance(
  ST_GeographyFromText('POINT(-118.4079 33.9434)'), -- Los Angeles (LAX)
  ST_GeographyFromText('POINT(2.5559 49.0083)')     -- Paris (CDG)
);
```

9124665.27317673   所有geography计算的返回值都以**米**为单位，所以答案是9124km

### **使用Geography**

为了将geometry数据加载到geography表中，首先需要将geometry转换到 EPSG:4326（经度-longitude/纬度-latitude），然后再将其转换为geography。**ST_Transform(geometry, srid)**函数能将坐标转换为地理坐标，**Geography(geometry)**函数能将基于EPSG:4326的geometry数据类型转换为geography数据类型

```sql
CREATE TABLE nyc_subway_stations_geog AS
SELECT
  Geography(ST_Transform(geom,4326)) AS geog,
  name,
  routes
FROM nyc_subway_stations;
```

在geography表上构建**空间索**引与在geometry表上构建**空间索引**完全相同：

```sql
CREATE INDEX nyc_subway_stations_geog_gix
ON nyc_subway_stations_geog 
USING GIST (geog);
```

不同之处在于：geography空间索引将正确地处理覆盖极点或国际日期变更线的要素的查询，而geometry空间索引则不会

对于geography类型，只有相关的少量空间函数：

- **ST_AsText(geography)** returns `text`
- **ST_GeographyFromText(text)** returns `geography`
- **ST_AsBinary(geography)** returns `bytea`
- **ST_GeogFromWKB(bytea)** returns `geography`
- **ST_AsSVG(geography)** returns `text`
- **ST_AsGML(geography)** returns `text`
- **ST_AsKML(geography)** returns `text`
- **ST_AsGeoJson(geography)** returns `text`
- **ST_Distance(geography, geography)** returns `double`
- **ST_DWithin(geography, geography, float8)** returns `boolean`
- **ST_Area(geography)** returns `double`
- **ST_Length(geography)** returns `double`
- **ST_Covers(geography, geography)** returns `boolean`
- **ST_CoveredBy(geography, geography)** returns `boolean`
- **ST_Intersects(geography, geography)** returns `boolean`
- **ST_Buffer(geography, float8)** returns `geography`[[1\]](https://link.zhihu.com/?target=https%3A//postgis.net/workshops/postgis-intro/geography.html%23casting-note)
- **ST_Intersection(geography, geography)** returns `geography`[[1\]](https://link.zhihu.com/?target=https%3A//postgis.net/workshops/postgis-intro/geography.html%23casting-note)

### 创建Geography表

用于创建含有geography列的新表的SQL与用于创建geometry表的SQL非常相似。但是，geography包含在表创建时直接指定表类型的功能。例如：

```sql
CREATE TABLE airports (
  code VARCHAR(3),
  geog GEOGRAPHY(Point)
);
 
INSERT INTO airports VALUES ('LAX', 'POINT(-118.4079 33.9434)');
INSERT INTO airports VALUES ('CDG', 'POINT(2.5559 49.0083)');
INSERT INTO airports VALUES ('KEF', 'POINT(-22.6056 63.9850)');
```

在表定义中，GEOGRAPHY(Point)将airport数据类型指定为点。新的geography字段不会在geometry_columns视图中注册，相反，它们是在名为**geography_columns**的视图中注册的

### 转换为Geometry

虽然geography类型的空间函数已经可以处理许多问题，但有时你可能需要访问仅由geometry类型支持的其他空间函数。幸运的是，你可以将对象从geography转换为geometry。ST_X(point)函数仅支持geometry类型，那我们怎样才能从我们的geography类型数据中读取X坐标呢？

```sql
SELECT code, ST_X(geog::geometry) AS longitude FROM airports;
```

通过将::geometry附加到geography值后面，可以将对象转换为SRID为4326的geometry。现在，我们就可以使用任何的geometry函数了。但是，请记住-现在我们的对象是geometry，坐标将被解释为**笛卡尔平面坐标**，而不是**球体坐标**。

### 为什么使用Geography

地理坐标是大众普遍接受的坐标——每个人都知道经度/纬度的含义，但很少有人理解UTM坐标的含义。那么为什么不一直用geography类型呢？

- 首先，如前所述，可直接支持geography类型的函数要少得多。
- 其次，球体上的计算要比笛卡尔计算计算量大得多。例如，基于笛卡尔平面坐标的计算距离的公式（Pythagoras)涉及一次对sqrt()的调用，基于球体坐标的计算距离的公式包含两次sqrt()调用、一次arctan()调用、四次sin()调用和两次cos()调用，三角函数的计算是非常耗费资源的。

结论：

**如果你的数据在地理范围上是紧凑的（包含在州、县或市内），请使用基于笛卡尔坐标的geometry类型**，因为范围小，所以可以使你的数据有意义。有关可能的参考系统的选择，请参见[http://spatialreference.org](https://link.zhihu.com/?target=http%3A//spatialreference.org/)站点并输入您所在区域的名称

**如果你需要测量在地理范围上是分散的数据集（覆盖世界大部分地区）的距离，请使用geography类型。**通过基于geography类型运行而节省的应用程序级别复杂性将抵消任何硬件性能问题。同时通过将geography类型转换为geometry类型的方法可以消除大多数功能限制问题

## 几何图形的创建函数

"**几何图形创建函数**"以几何图形作为输入并输出新的图形

### ST_Centroid/ST_PointOnSurface

将多边形要素替换为要素的点表示

- **ST_Centroid(geometry)** —— 返回大约位于输入几何图形的**质心**上的点。这种简单的计算速度非常快，但有时并不可取，因为返回点不一定在要素本身上。如果输入的几何图形具有凹性（形如字母'C'的几何图形），则返回的质心可能不在图形的内部。
- **ST_PointOnSurface(geometry)** —— 返回保证在输入多边形内的点。从计算上讲，它比centroid操作代价要大得多。

### ST_Buffer

**缓冲区操作**在GIS工作流中很常见，在[PostGIS](https://zhida.zhihu.com/search?content_id=102182579&content_type=Article&match_order=1&q=PostGIS&zhida_source=entity)中也可以进行缓冲区操作

 **ST_Buffer(geometry, distance)**接受几何图形和缓冲区距离作为参数，并输出一个多边形，这个多边形的边界与输入的几何图形之间的距离与输入的缓冲区距离相等

ST_Buffer函数也接受负的距离值，从而在输入的多边形内构建内接多边形。而对于线串和点，只会返回空值

### ST_Intersection

通过计算两个重叠多边形的**交集**来创建新的几何图形

**ST_Intersection(geometry A, geometry B)**函数返回两个参数共有的空间区域（或直线，或点）。如果参数不相交，该函数将返回一个空几何图形

### ST_Union

**ST_Union**将两个几何图形合并起来。

ST_Union函数有两种形式：

- **ST_Union(geometry, geometry)** —— 接受两个几何图形参数并返回合并的并集
- **ST_Union([geometry])** —— 接受一组几何图形并返回全部几何图形的并集。ST_Union([geometry])可与GROUP BY语句一起使用，以创建经过细致合并的基本几何图形集。这种操作非常强大

我们可以通过分组合并blkid键前5个数字相同的所有几何图形来创建县地图

```sql
-- Create a nyc_census_counties table by merging census blocks
CREATE TABLE nyc_census_counties AS
SELECT
  ST_Union(geom)::Geometry(MultiPolygon,26918) AS geom,
  SubStr(blkid,1,5) AS countyid
FROM nyc_census_blocks
GROUP BY countyid;
```



## 函数总结

`postgis_full_version()`

`char_length(string)` —— 返回字符串中的字符数

`UpdateGeometrySRID(table_name,geom_column_name,srid)` —— 更新空间数据表的坐标系

### 聚合函数

`avg()` —— 返回一个数值列的平均值

`stddev()` —— 返回输入值的标准差

`sum()` —— 返回一个数值列的和

`count()` —— 返回一个列的记录数

### 数据管理

#### 元数据

`ST_GeometryType(geometry)` —— 返回几何图形的类型

`ST_NDims(geometry)` —— 返回几何图形的维数

`ST_SRID(geometry)` —— 返回几何图形的空间参考标识码

#### 投影

`ST_SetSRID(geometry，SRID）` —— 为图形定义投影并返回

`ST_Transform(geometry, srid)` —— 返回投影变换后的图形

#### 点

`ST_X(geometry)` —— 返回 X 坐标

`ST_Y(geometry)` —— 返回 Y 坐标

`ST_Z(geometry)` —— 返回 Z 坐标

`ST_M(geometry)` —— 返回 M 信息

#### 线

`ST_Length(geometry)` —— 返回线串的长度

`ST_StartPoint(geometry)` —— 将线串的第一个坐标作为点返回

`ST_EndPoint(geometry)` —— 将线串的最后一个坐标作为点返回

`ST_NPoints(geometry)` —— 返回线串的坐标数量

#### 面

`ST_Area(geometry)` —— 返回多边形的面积

`ST_NRings(geometry)` —— 返回多边形中环的数量（通常为 1 个，其他是孔）

`ST_ExteriorRing(geometry)` —— 以线串的形式返回多边形最外面的环

`ST_InteriorRingN(geometry, n)` —— 以线串形式返回指定的内部环

`ST_Perimeter(geometry)` —— 返回所有环的长度

#### 集合

`ST_NumGeometries(geometry)` —— 返回集合中的组成部分的数量

`ST_GeometryN(geometry, n)` —— 返回集合中指定的组成部分

`ST_Area(geometry)` —— 返回集合中所有多边形组成部分的总面积

`ST_Length(geometry)` —— 返回所有线段组成部分的总长度

### 空间分析

#### true/false测试

`ST_Equals()`

`ST_Intersects()`

`ST_Disjoint()`

`ST_Crosses()`

`ST_Overlaps()`

`ST_Touches()`

`ST_Within()`

`ST_Contains()`

`ST_Distance()`

`ST_DWithin()`

#### 空间分析

`ST_Centroid(geometry)`

`ST_PointOnSurface(geometry)`

`ST_Buffer(geometry, distance)`

`ST_Intersection(geometry A, geometry B)`

`ST_Union([geometry])`

### 格式转换函数

[几何图形的输入与输出](#几何图形的输入与输出)



