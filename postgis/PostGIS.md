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

![Snipaste_2025-03-12_15-50-39](C:\code\webgis\postgis\img\Snipaste_2025-03-12_15-50-39.png)

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

<img src="C:\code\webgis\postgis\img\Snipaste_2025-03-12_16-04-05.png" alt="Snipaste_2025-03-12_16-04-05" style="zoom: 67%;" />

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

<img src="C:\code\webgis\postgis\img\Snipaste_2025-03-12_16-56-41.png" alt="Snipaste_2025-03-12_16-56-41" style="zoom:67%;" />

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

   <img src="C:\code\webgis\postgis\img\Snipaste_2025-03-12_22-08-49.png" alt="Snipaste_2025-03-12_22-08-49" style="zoom: 33%;" />

   如果两个图形有相同的空间部分，即如果它们的边界或内部相交，则ST_Intersects(geometry A, geometry B)返回TRUE

   ST_Intersects()方法的对立方法是**ST_Disjoint(geometry A, geometry B)**。

   如果两个几何图形没有相交的部分，则它们不相交，反之亦然。

   事实上测试"not intersect"（!ST_Intersects）通常比测试"disjoint"（ST_Disjoint）更有效，因为intersect测试会自动使用**空间索引**。

2. **ST_Crosses(geometry A, geometry B)**

   <img src="C:\code\webgis\postgis\img\Snipaste_2025-03-12_22-08-59.png" alt="Snipaste_2025-03-12_22-08-59" style="zoom:33%;" />

   对于multipoint/polygon、multipoint/linestring、linestring/linestring、linestring/polygon和linestring/multipolygon的比较，如果相交生成的几何图形的维度小于两个源几何图形的最大维度，且相交集位于两个源几何图形的内部，则**ST_Crosses(geometry A, geometry B)**将返回TRUE（其实就是判断两个几何图形是否交叉）

3. **ST_Overlaps(geometry A, geometry B)**

   <img src="C:\code\webgis\postgis\img\Snipaste_2025-03-12_22-09-06.png" alt="Snipaste_2025-03-12_22-09-06" style="zoom:38%;" />
   
   **ST_Overlaps(geometry A, geometry B)**比较两个相同维度的几何图形，如果它们的结果集与两个源几何图形都不同但具有相同维度，则返回TRUE（其实就是判断两个几何图形是否叠置）

### 空间接触

**ST_Touches(geometry A, geometry B)**测试两个几何图形是否在它们的边界上接触，但在它们的内部不相交

<img src="C:\code\webgis\postgis\img\Snipaste_2025-03-12_22-17-17.png" alt="Snipaste_2025-03-12_22-17-17" style="zoom:38%;" />

如果两个几何图形的**边界相交**，或者只有一个几何图形的内部与另一个几何图形的边界相交，则**ST_Touches(geometry A, geometry B)**将返回TRUE

### 空间包含

**ST_Within(geometry A, geometry B)**和**ST_Contains(geometry A, geometry B)**测试一个几何图形是否完全位于另一个几何图形内

如果第一个几何图形完全位于第二个几何图形内，则ST_Within(geometry A, geometry B)返回TRUE，ST_Within()测试的结果与ST_Contains()完全相反。

如果第二个几何图形B完全包含在第一个几何图形A内，则ST_Contains(geometry A, geometry B)返回TRUE

### 空间距离

**ST_Distance(geometry A, geometry B)**计算两个几何图形之间的最短距离，并将其作为浮点数返回

为了测试两个几何图形之间的距离是否在某个范围之内，**ST_DWithin(geometry A, geometry B，dis)**函数提供了一个基于索引加速的功能

## 空间连接















## 函数总结

`postgis_full_version()`

`char_length(string)` —— 返回字符串中的字符数

`UpdateGeometrySRID(table_name,geom_column_name,srid)` —— 为表指定 SRID

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

### 格式转换函数

[几何图形的输入与输出](#几何图形的输入与输出)

