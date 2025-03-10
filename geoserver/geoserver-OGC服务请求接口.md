# OGC服务请求接口

## WMS-web map service

### GetCapabilities

检索有关服务的元数据，包括支持的操作和参数，以及可用层的列表

**请求参数：**

| params  | require | desc                                     |
| :------ | :------ | :--------------------------------------- |
| service | yes     | 服务名称 `WMS`                           |
| version | yes     | 服务版本 `1.0.0`,`1.1.0`,`1.1.1`,`1.3.0` |
| request | yes     | 操作名称 `GetCapabilities`               |

**示例：**

> http://localhost:8070/geoserver/wms?
> service=wms&
> version=1.1.1&
> request=GetCapabilities 

**响应结果(xml)：**

| part    | desc                                                         |
| ------- | ------------------------------------------------------------ |
| service | 包含服务元数据，如服务名称、关键字和操作服务器的组织的联系信息 |
| request | 描述WMS服务提供的操作以及每个操作的参数和输出格式            |
| layer   | 列出可用的坐标系和图层。在geoserver中，层以“namespace:layer”的形式命名。每一层都提供服务元数据，如标题、摘要和关键字 |

### GetMap

检索指定区域和内容的地图图像

**请求参数：**

| params      | require | desc                                                         |
| ----------- | ------- | ------------------------------------------------------------ |
| service     | yes     |                                                              |
| version     | yes     |                                                              |
| request     | yes     | `GetMap`                                                     |
| layers      | yes     | 要在地图上显示的图层。以逗号分割多个图层名称                 |
| styles      | yes     | 要在其中渲染层的样式。以逗号分隔的样式名列表，如果需要默认样式，则为空 |
| srs/crs     | yes     | 地图输出的空间参考系统。srs为 `EPSG:nnn`   `crs` 是WMS 1.3.0中使用的参数键 |
| bbox        | yes     | 地图范围的边界框。 `minx,miny,maxx,maxy` 以SRS为单位         |
| width       | yes     | 地图输出的宽度，以像素为单位                                 |
| height      | yes     | 地图输出的高度，以像素为单位                                 |
| format      | yes     | 映射输出的格式   [WMS输出格式](https://www.osgeo.cn/geoserver-user-manual/services/wms/outputformats.html#wms-output-formats) |
| transparent | no      | 地图背景是否应透明。`true`,`false(默认)`                     |
| bgcolor     | no      | 地图图像的背景色。`ffffff(默认)`                             |
| exceptions  | no      | 报告异常的格式。 `application/vnd.ogc.se_xml(默认)`          |
| time        | no      | 地图数据的时间值或范围                                       |
| sld         | no      | 一个引用 [StyledLayerDescriptor](https://www.osgeo.cn/geoserver-user-manual/styling/index.html#styling) 控制或增强地图图层和样式的XML文件 |
| sld_body    | no      | 已编码的URL [StyledLayerDescriptor](https://www.osgeo.cn/geoserver-user-manual/styling/index.html#styling) 控制或增强地图图层和样式的XML文档 |

**示例：**

> http://localhost:8070/geoserver/webgis-test/wms?
> request=GetMap
> &service=WMS
> &version=1.1.1
> &layers=webgis-test:山东省图层组
> &styles=
> &srs=EPSG:4490
> &bbox=114.80586593155356,34.37736573293456,122.70560688985348,38.40051200014238
> &width=780
> &height=330
> &format=image/png

注：在openlayers中使用ImageWMS()请求地图时srs、bbox、width、height 值可根据view对象状态动态生成

### GetFeatureInfo

检索地图上像素位置的基础数据，包括几何图形和属性值

**请求参数：**

| params        | require | desc                                                         |
| ------------- | ------- | ------------------------------------------------------------ |
| service       | yes     |                                                              |
| version       | yes     |                                                              |
| request       | yes     | `GetFeatureInfo`                                             |
| layers        | yes     |                                                              |
| styles        | yes     |                                                              |
| srs/crs       | yes     |                                                              |
| bbox          | yes     |                                                              |
| width         | yes     |                                                              |
| height        | yes     |                                                              |
| query_layers  | yes     | 要查询的图层。以逗号分隔多个层                               |
| x/i           | yes     | 地图上查询点的X坐标，以像素为单位。0是左侧。 `i` 是WMS 1.3.0中使用的参数键 |
| y/j           | yes     | 地图上查询点的Y坐标，以像素为单位。0是顶部。 `j` 是WMS 1.3.0中使用的参数键 |
| info_format   | no      | 要素信息响应的格式  `text/plain(默认)`                       |
| feature_count | no      | 要返回的最大要素数  `1(默认)`                                |
| exceptions    | no      | 报告异常的格式   `application/vnd.ogc.se_xml(默认)`          |

**示例：**

> http://localhost:8070/geoserver/webgis-test/wms?
> service=WMS
> &request=GetFeatureInfo
> &version=1.1.0
> &layers=webgis-test:山东省图层组
> &styles=
> &srs=EPSG:4490
> &bbox=114.67675804421779,35.54691099945008,122.30676292703029,36.73892760101258
> &width=1389
> &height=217
> &query_layers=webgis-test:县级行政区划
> &x=538
> &y=63
> &info_format=application/json
> &feature_count=1

### DescribeLayer

### GetLegendGraphic

### GetStyles



## WFS-web feature service

### GetCapabilities

生成一个元数据文档，描述服务器提供的WFS服务以及有效的WFS操作和参数

**请求参数：**

| params  | require | desc                       |
| ------- | ------- | -------------------------- |
| service | yes     | 服务名称 `WFS`             |
| version | yes     | 服务版本                   |
| request | yes     | 操作名称 `GetCapabilities` |

**示例：**

>http://localhost:8070/geoserver/wfs?
>service=wfs
>&version=1.1.0
>&request=GetCapabilities

**响应结果(xml)：**

| part                  | desc                                                         |
| --------------------- | ------------------------------------------------------------ |
| ServiceIdentification | 包含请求的基本头信息，例如 `Title` 和 `ServiceType` . 这个 `ServiceType` 指示支持哪些版本的WFS |
| ServiceProvider       | 提供有关发布WFS服务的公司的联系信息，包括电话、网站和电子邮件 |
| OperationsMetadata    | 描述WFS服务器支持的操作以及每个操作的参数。WFS服务器可能配置为不响应上面列出的操作 |
| FeatureTypeList       | 列出WFS服务器发布的要素列表。表单中列出了要素类型 `namespace:featuretype` .还列出了特征类型的默认投影，以及所述投影中数据的边界框 |
| Filter_Capabilities   | 列出可用于形成查询谓词的筛选器或表达式，例如， `SpatialOperators` （如 `Equals` ， `Touches` ） `ComparisonOperators` （如 `LessThan` ， `GreaterThan` ）。getCapabilities文档中不包括筛选器本身 |



### DescribeFeatureType

返回WFS服务支持的要素类型的描述

请求参数：

| params       | require | desc                                                         |
| ------------ | ------- | ------------------------------------------------------------ |
| service      | yes     | `WFS`                                                        |
| version      | yes     |                                                              |
| request      | yes     | `DescribeFeatureType`                                        |
| typeNames    | yes     | 要描述的要素类型的名称 (`typeName` 对于WFS 1.1.0及更早版本） |
| exceptions   | no      | 报告异常的格式  `application/vnd.ogc.se_xml(默认)`           |
| outputFormat | no      | 定义用于描述要素类型的方案描述语言                           |

示例：

>http://localhost:8070/geoserver/wfs?
>service=wfs
>&version=2.0.0
>&request=DescribeFeatureType
>&typeNames=webgis-test:县级行政区划,webgis-test:高速
>&outputFormat=application/json



### GetFeature

返回从数据源中选择的要素，包括几何图形和属性值

**请求参数：**

| params            | require | desc                                                         |
| ----------------- | ------- | ------------------------------------------------------------ |
| service           | yes     | `WFS`                                                        |
| version           | yes     |                                                              |
| requset           | yes     | `GetFeature`                                                 |
| typeNames         | yes     | 要素所在的图层名称，格式为`namespace:featuretype`            |
| featureID         | no      | 查询特定id要素                                               |
| count/maxFeatures | no      | 限制返回要素的数量， `count(wfs 2.0.0)` 或 `maxFeatures(wfs early)` |
| sortBy            | no      | 使用`count=n`返回的n个要素取决于数据的内部结构。但可以基于属性值排序后再返回要素。`sortBy=attr+A(默认)`,升序;`+D`,降序 |
| propertyName      | no      | 查询属性值，以逗号分割多个属性                               |
| bbox              | no      | 基于bbox框查询要素。`bbox=a1,b1,a2,b2,[crs]` . `a1` , `b1` , `a2` 和 `b2` 表示坐标值。可选 `crs` 参数用于命名bbox坐标的crs(如果它们与FeatureTypes本机crs不同) |
| srsName           | no      | 为返回的要素指定坐标系                                       |

**示例：**

1. 请求图层所有要素

   >http://localhost:8070/geoserver/wfs?
   >service=wfs
   >&version=2.0.0
   >&request=GetFeature
   >&typeNames=webgis-test:高速

2. 请求指定id要素

   >http://localhost:8070/geoserver/wfs?
   >service=wfs
   >&version=2.0.0
   >&request=GetFeature
   >&typeNames=webgis-test:高速
   >&featureID=高速.119

3. 限制返回要素个数

   >http://localhost:8070/geoserver/wfs?
   >service=wfs
   >&version=2.0.0
   >&request=GetFeature
   >&typeNames=webgis-test:高速
   >&count=10

4. 按某属性值升序排列并请求前10个要素

   >http://localhost:8070/geoserver/wfs?
   >service=wfs
   >&version=2.0.0
   >&request=GetFeature
   >&typeNames=webgis-test:高速
   >&count=10
   >&sortBy=ROUTENUM+A

5. 查询所有要素的某两个属性值

   >http://localhost:8070/geoserver/wfs?
   >service=wfs
   >&version=2.0.0
   >&request=GetFeature
   >&typeNames=webgis-test:高速
   >&propertyName=the_geom,ROUTENUM

6. 按空间范围查询要素

   >http://localhost:8070/geoserver/wfs?
   >service=wfs
   >&version=2.0.0
   >&request=GetFeature
   >&typeNames=webgis-test:高速
   >&srsName=EPSG:4490
   >&bbox=36,117,39,123













