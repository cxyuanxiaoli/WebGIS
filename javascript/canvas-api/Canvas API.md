# Canvas API

## 渲染上下文(The rendering context)

### HTMLCanvasElement.getContext('2d')

这个方法是用来获得渲染上下文和它的绘画功能。`getContext()`接受一个参数，即上下文的类型。

```js
var canvas = document.getElementById("tutorial");
var ctx = canvas.getContext("2d");
```

## 绘制矩形

### fillRect(x,y,width,height)

绘制一个填充的矩形

### strokeRect(x,y,width,height)

绘制一个矩形的边框

### clearRect(x,y,width,height)

清除指定矩形区域，让清除部分完全透明

上面提供的方法之中每一个都包含了相同的参数。x 与 y 指定了在 canvas 画布上所绘制的矩形的左上角（相对于原点）的坐标。width 和 height 设置矩形的尺寸。

不同于下一节所要介绍的路径函数（path function），以上的三个函数绘制之后会马上显现在 canvas 上，即时生效。

## 绘制路径

图形的基本元素是路径。路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。一个路径，甚至一个子路径，都是闭合的。使用路径绘制图形需要一些额外的步骤。

1. 首先，你需要创建路径起始点。
2. 然后你使用画图命令去画出路径。
3. 之后你把路径封闭。
4. 一旦路径生成，你就能通过描边或填充路径区域来渲染图形。

### beginPath()

新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。

### closePath()

闭合路径之后图形绘制命令又重新指向到上下文中。

### stroke()

通过线条来绘制图形轮廓。

### fill()

通过填充路径的内容区域生成实心的图形。

生成路径的第一步叫做 beginPath()。本质上，路径是由很多子路径构成，这些子路径都是在一个列表中，所有的子路径（线、弧形、等等）构成图形。而每次这个方法调用之后，列表清空重置，然后我们就可以重新绘制新的图形。

第二步就是调用函数指定绘制路径。

第三，就是闭合路径 closePath(),不是必需的。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。

### moveTo(x,y)

将笔触移动到指定的坐标 x 以及 y 上。

当 canvas 初始化或者`beginPath()`调用后，你通常会使用`moveTo()`函数设置起点。我们也能够使用`moveTo()`绘制一些不连续的路径。

### lineTo(x,y)

绘制一条从当前位置到指定 x 以及 y 位置的直线。

### arc(x,y,radius,startAngle,endAngle,anticlockwise)

画一个以（x,y）为圆心的以 radius 为半径的圆弧（圆），从 startAngle 开始到 endAngle 结束，按照 anticlockwise 给定的方向（默认为顺时针）来生成。

### arcTo(x1,y1,x2,y2,radius)

根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点。

### quadraticCurveTo(cp1x,cp1y,x,y)

绘制二次贝塞尔曲线，`cp1x,cp1y` 为一个控制点，`x,y` 为结束点。

### bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y)

绘制三次贝塞尔曲线，`cp1x,cp1y`为控制点一，`cp2x,cp2y`为控制点二，`x,y`为结束点。

### rect(x,y,width,height)

绘制一个左上角坐标为（x,y），宽高为 width 以及 height 的矩形。

## Path2D对象

### Path2D()

`Path2D()`会返回一个新初始化的 Path2D 对象（可能将某一个路径作为变量——创建一个它的副本，或者将一个包含 SVG path 数据的字符串作为变量）。

所有的路径方法比如`moveTo`, `rect`, `arc`或`quadraticCurveTo`等，都可以在 Path2D 中使用。

### Path2D.addPath(path[,transform])

添加了一条路径到当前路径（可能添加了一个变换矩阵）。

带路径参数的`stroke`和`fill`可以把对象画在画布上。

```js
var ctx = canvas.getContext("2d");

var rectangle = new Path2D();
rectangle.rect(10, 10, 50, 50);
var circle = new Path2D();
circle.moveTo(125, 35);
circle.arc(100, 35, 25, 0, 2 * Math.PI);

ctx.stroke(rectangle);
ctx.fill(circle);
```

## 应用样式

### 色彩

#### ctx.fillStyle = color

设置图形的填充颜色。

#### ctx.strokeStyle = color

设置图形轮廓的颜色。

`color` 可以是表示 CSS 颜色值的字符串，渐变对象(CanvasGradient)或者图案对象(CanvasPattern)。

CSS字符串：

```js
// 这些 fillStyle 的值均为“橙色”
ctx.fillStyle = "orange";
ctx.fillStyle = "#FFA500";
ctx.fillStyle = "rgb(255,165,0)";
ctx.fillStyle = "rgba(255,165,0,1)";
```

Canvsa渐变：

#### ctx.createLinearGradient(x1,y1,x2,y2)

线性渐变，接受 4 个参数，表示渐变的起点 (x1,y1) 与终点 (x2,y2)。

#### ctx.createRadialGradient(x1,y1,r1,x2,y2,r2)

径向渐变，接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。

#### ctx.createConicGradient(startAngle,x,y)

锥形渐变，接受 3 个参数，表示渐变的起始角度与起点 (x,y)。

#### gradient.addColorStop(position, color)

创建出 `canvasGradient` 对象后，我们就可以用 `addColorStop` 方法给它上色了。

addColorStop 方法接受 2 个参数，`position` 参数必须是一个 0.0 与 1.0 之间的数值，表示渐变中颜色所在的相对位置。`color` 参数必须是一个有效的 CSS 颜色值（如 #FFF、rgba(0,0,0,1)，等等）。

Canvas图案：

#### ctx.createPattern(image,type)

该方法接受两个参数。Image 可以是一个 `Image` 对象的引用，或者另一个 canvas 对象。`Type` 必须是下面的字符串值之一：`repeat`，`repeat-x`，`repeat-y` 和 `no-repeat`。

```js
// 创建新 image 对象，用作图案
const img = new Image();
img.src = "canvas_create_pattern.png";
img.onload = () => {
  // 创建图案
  const pattern = ctx.createPattern(img, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 150, 150);
};
```

### 透明度

通过设置 `globalAlpha` 属性或者使用一个半透明颜色作为轮廓或填充的样式。

#### ctx.globalAlpha = transparencyValue

这个属性影响到 canvas 里所有图形的透明度，有效的值范围是 0.0（完全透明）到 1.0（完全不透明），默认是 1.0。

### 线型

#### ctx.lineWidth = value

设置线条宽度。

#### ctx.lineCap = type

设置线条末端样式。

#### ctx.lineJoin = type

设定线条与线条间接合处的样式。

#### ctx.miterLimit = value

限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。

`miterLimit` 属性就是用来设定外延交点与连接点的最大距离，如果交点距离大于此值，连接效果会变成了 bevel。注意，最大斜接长度（即交点距离）是当前坐标系测量线宽与此`miterLimit`属性值（默认为 10.0）的乘积，所以`miterLimit`可以单独设置，不受显示比例改变或任何仿射变换的影响：它只影响线条边缘的有效绘制形状。

它也可以被等效定义为线条内外连接点距离（`miterLength`）与线宽（`lineWidth`）的最大允许比值（因为路径点是内外连接点的中点）。这等同于相交线段最小内夹角（*θ*）的一半的余割值，小于此角度的斜接将不会被渲染，而仅渲染斜边连接：

- `miterLimit` = **max** `miterLength` / `lineWidth` = 1 / **sin** ( **min** *θ* / 2 )

#### ctx.getLineDash()

返回一个包含当前虚线样式，长度为非负偶数的数组。

#### ctx.setLineDash(segments)

设置当前虚线样式。

#### ctx.lineDashOffset = value

设置虚线样式的起始偏移量。

### 阴影

#### ctx.shadowOffsetX = float

#### ctx.shadowOffsetY = float

`shadowOffsetX` 和 `shadowOffsetY` 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 `0`。

#### ctx.shadowBlur = float

shadowBlur 用于设定阴影的模糊程度，其数值并不跟像素数量挂钩，也不受变换矩阵的影响，默认为 `0`。

#### ctx.shadowColor = color

shadowColor 是标准的 CSS 颜色值，用于设定阴影颜色效果，默认是全透明的黑色。

## Canvas 填充规则

当我们用到 `fill`（或者 `clip`和`isPointinPath`）你可以选择一个填充规则，该填充规则根据某处在路径的外面或者里面来决定该处是否被填充，这对于自己与自己路径相交或者路径被嵌套的时候是有用的。

两个可能的值：

- `nonzero`

  非零环绕规则, 默认值。

- `evenodd`

  奇偶环绕规则。

奇-偶规则（Odd-even Rule）：从该点p任意方向的一条射线，若**与该射线相交的多边形边的数目为奇数**，则p是多边形内部点，否则是外部点。

非零环绕数规则（Nonzero Winding Number Rule）：将环绕数初始化为零。再从该点p作任意方向的一条射线。当从p点沿射线方向移动时，对在每个方向上穿过射线的边计数，每当多边形的边**从左到右穿过射线时，环绕数加1，从右到左时，环绕数减1**。处理完多边形的所有相关边之后，若环绕数为非零，则p为内部点，否则，p是外部点。

## 绘制文本

### ctx.fillText(text,x,y[,maxWidth])

在指定的 (x,y) 位置填充指定的文本。绘制的最大宽度是可选的。

### ctx.strokeText(text,x,y[,maxWidth])

在指定的 (x,y) 位置绘制文本边框。绘制的最大宽度是可选的。

文本样式控制：

### ctx.font = value

当前我们用来绘制文本的文本样式。这个字符串使用和 CSS `font` 属性相同的语法。默认的字体是 `10px sans-serif`。

### ctx.textAlign = value

文本对齐选项。可选的值包括：`start`、`end`、`left`、`right` 或 `center`。默认值是 `start`。

### ctx.textBaseline = value

基线对齐选项。可选的值包括：`top`、`hanging`、`middle`、`alphabetic`、`ideographic`、`bottom`。默认值是 `alphabetic`。

### ctx.direction = value

文本方向。可能的值包括：`ltr`、`rtl`、`inherit`。默认值是 `inherit`。

### ctx.measureText()

返回一个包含以当前文本样式绘制指定文本时，其所具有的宽度（以像素为单位）的 `TextMetrics` 对象。

## 使用图像

### ctx.drawImage(image,x,y)

其中 `image` 是 `image` 或者 `canvas` 对象，`x` 和 `y` 是其在目标 `canvas` 里的起始坐标。

canvas 的 API 可以使用下面这些类型中的一种作为图片的源：

- **`HTMLImageElement`**

  这些图片是由 `Image()` 函数构造出来的，或者任何的 `<img>`元素

- **`HTMLVideoElement`**

  用一个 HTML 的 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/video)元素作为你的图片源，可以从视频中抓取当前帧作为一个图像

- **`HTMLCanvasElement`**

  可以使用另一个 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/canvas) 元素作为你的图片源。

- **`ImageBitmap`**

  这是一个高性能的位图，可以低延迟地绘制，它可以从上述的所有源以及其他几种源中生成。

这些源统一由 `CanvasImageSource`类型来引用。

### ctx.drawImage(image,x,y,width,height)

这个方法多了 2 个参数：`width` 和 `height，`这两个参数用来控制 当向 canvas 画入时应该缩放的大小。

### ctx.drawImage(image,sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight)

第一个参数和其他的是相同的，都是一个图像或者另一个 canvas 的引用。其他 8 个参数中前 4 个是定义图像源的切片位置和大小，后 4 个则是定义切片的目标显示位置和大小。

### ctx.imageSmoothingEnabled = boolean

可以通过使用绘图环境的`imageSmoothingEnabled`属性来控制是否在缩放图像时使用平滑算法。默认值为`true`，即启用平滑缩放。

## 状态的保存与恢复

### ctx.save()

保存画布 (canvas) 的所有状态。

### ctx.restore()

save 和 restore 方法是用来保存和恢复 canvas 状态的，都没有参数。Canvas 的状态就是当前画面应用的所有样式和变形的一个快照。

Canvas 状态存储在栈中，每当`save()`方法被调用后，当前的状态就被推送到栈中保存。一个绘画状态包括：

- 当前应用的变形
- 下面这些属性：strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation, font, textAlign, textBaseline, direction, imageSmoothingEnabled
- 当前的裁切路径（clipping path）

## 变换

### ctx.translate(x,y)

`translate`方法接受两个参数。`x` 是左右偏移量，`y` 是上下偏移量。

### ctx.rotate(angle)

这个方法只接受一个参数：旋转的角度 (angle)，它是顺时针方向的，以弧度为单位的值。

### ctx.scale(x,y)

`scale`方法可以缩放画布的水平和垂直的单位。两个参数都是实数，可以为负数，x 为水平缩放因子，y 为垂直缩放因子，如果比 1 小，会缩小图形，如果比 1 大会放大图形。默认值为 1，为实际大小。

画布初始情况下，是以左上角坐标为原点的第一象限。如果参数为负实数，相当于以 x 或 y 轴作为对称轴镜像反转（例如，使用`translate(0,canvas.height); scale(1,-1);` 以 y 轴作为对称轴镜像反转，就可得到著名的笛卡尔坐标系，左下角为原点）。

### ctx.transform(a,b,c,d,e,f)

这个方法是将当前的变形矩阵乘上一个基于自身参数的矩阵，如下面的矩阵所示：

[ a  c  e ]

[ b  d  f ]

[ 0  0  1 ]

如果任意一个参数是 `Infinity`，变形矩阵也必须被标记为无限大，否则会抛出异常。

- `a (m11)`

  水平方向的缩放

- `b(m12)`

  竖直方向的倾斜偏移

- `c(m21)`

  水平方向的倾斜偏移

- `d(m22)`

  竖直方向的缩放

- `e(dx)`

  水平方向的移动

- `f(dy)`

  竖直方向的移动

### ctx.setTransform(a,b,c,d,e,f)

这个方法会将当前的变形矩阵重置为单位矩阵，然后用相同的参数调用 `transform`方法。如果任意一个参数是无限大，那么变形矩阵也必须被标记为无限大，否则会抛出异常。从根本上来说，该方法是取消了当前变形，然后设置为指定的变形，一步完成。

### ctx.resetTransform()

重置当前变形为单位矩阵，它和调用以下语句是一样的：`ctx.setTransform(1, 0, 0, 1, 0, 0);`

## 组合

### ctx.globalCompositeOperation = type

这个属性设定了在画新图形时采用的遮盖策略，其值是一个标识 12 种遮盖方式的字符串。

- `"source-over"`

  这是默认设置，并在现有画布上绘制新图形。

- `"source-in"`

  仅在新形状和目标画布重叠的地方绘制新形状。其他的都是透明的。

- `"source-out"`

  在不与现有画布内容重叠的地方绘制新图形。

- `"source-atop"`

  只在与现有画布内容重叠的地方绘制新图形。

- `"destination-over"`

  在现有画布内容的后面绘制新的图形。

- `"destination-in"`

  仅保留现有画布内容和新形状重叠的部分。其他的都是透明的。

- `"destination-out"`

  仅保留现有画布内容和新形状不重叠的部分。

- `"destination-atop"`

  仅保留现有画布内容和新形状重叠的部分。新形状是在现有画布内容的后面绘制的。

- `"lighter"`

  两个重叠图形的颜色是通过颜色值相加来确定的。

- `"copy"`

  只显示新图形。

- `"xor"`

  形状在重叠处变为透明，并在其他地方正常绘制。

- `"multiply"`

  将顶层像素与底层相应像素相乘，结果是一幅更黑暗的图片。

- `"screen"`

  像素被倒转、相乘、再倒转，结果是一幅更明亮的图片（与 `multiply` 相反）。

- `"overlay"`

  `multiply` 和 `screen` 的结合。原本暗的地方更暗，原本亮的地方更亮。

- `"darken"`

  保留两个图层中最暗的像素。

- `"lighten"`

  保留两个图层中最亮的像素。

- `"color-dodge"`

  将底层除以顶层的反置。

- `"color-burn"`

  将反置的底层除以顶层，然后将结果反过来。

- `"hard-light"`

  类似于 `overlay`，`multiply` 和 `screen` 的结合——但上下图层互换了。

- `"soft-light"`

  柔和版本的 `hard-light`。纯黑或纯白不会导致纯黑或纯白。

- `"difference"`

  从顶层减去底层（或反之亦然），始终得到正值。

- `"exclusion"`

  与 `difference` 类似，但对比度较低。

- `"hue"`

  保留底层的亮度（luma）和色度（chroma），同时采用顶层的色调（hue）。

- `"saturation"`

  保留底层的亮度和色调，同时采用顶层的色度。

- `"color"`

  保留了底层的亮度，同时采用了顶层的色调和色度。

- `"luminosity"`

  保持底层的色调和色度，同时采用顶层的亮度。

### ctx.clip()

将当前正在构建的路径转换为当前的裁剪路径。

## 动画





































