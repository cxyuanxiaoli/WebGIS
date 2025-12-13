# ThreeJS

## 几何体

### BufferGeometry

#### 属性

* `.attributes.position`

  用于设置几何体的顶点数据，属性值为 `BufferAttribute` 对象

* `.attributes.normal`

  设置几何体各顶点的法线数据，以使几何体正常显示其受光照影响，属性值为 `BufferAttribute` 对象

* `.attributes.uv`

  用于将图像像素映射到三维模型表面的数据，属性值为 `BufferAttribute` 对象

* `.index`

  用于设置几何体的顶点索引数据，以降低顶点数据的重复，属性值为 `BufferAttribute` 对象

  ```js
  const polyVertices = new Float32Array([
      0, 0, -90, //顶点1坐标
      80, 0, -90, //顶点2坐标
      80, 80, -90, //顶点3坐标
      0, 80, -90, //顶点4坐标
  ]);
  const polyIndexs = new Uint16Array([0, 1, 2, 0, 2, 3]);
  const polyNormals = new Float32Array([
      0, 0, 1, //顶点1法线 ( 法向量 )
      0, 0, 1, //顶点2法线
      0, 0, 1, //顶点3法线
      0, 0, 1, //顶点4法线
  ]);
  const polyGeom = new THREE.BufferGeometry();
  // 定义几何体顶点、索引、法线数据
  polyGeom.attributes.position = new THREE.BufferAttribute(polyVertices, 3);
  polyGeom.index = new THREE.BufferAttribute(polyIndexs, 1);
  polyGeom.attributes.normal = new THREE.BufferAttribute(polyNormals, 3);
  // 定义几何体UV坐标数据
  const uvData=new Float32Array([
      0, 0, //图片左下角
      1, 0, //图片右下角
      0, 1, //图片左上角
      1, 1, //图片右上角
  ])
  polyGeom.attributes.uv = new THREE.BufferAttribute(uvData, 2);
  ```



## 材质

### Mesh-Material

### PointsMaterial



### Line-Material





## 模型

###  Mesh

#### 属性

* `.geometry`

  模型的几何结构，属性值为 `BufferGeometry` 对象

* `.material`

  模型的材质，属性值为 `Material` 对象



### Points



### Line / LineLoop / LineSegments



## 纹理

### Texture



### CubeTexture



## 曲线





## 工具类

### Vector

### Euler

### Color



