# ECharts-v5

## 常用配置项

* title



## Title

### show = true

### text = ' '

主标题文本，支持使用 `\n` 换行。

###  subtext = ' '

### textStyle

* color = '#333'
* fontStyle = 'normal'
  * `'normal'`
  * `'italic'`
  * `'oblique'`
* fontWeight = 'bolder'
  * `'normal'`
  * `'bold'`
  * `'bolder'`
  * `'lighter'`
  * 100 | 200 | 300 | 400...
*  fontFamily = 'sans-serif'
  * 'serif' , 'monospace', 'Arial', 'Courier New', 'Microsoft YaHei', ...
* fontSize = 18
* textShadowColor = 'transparent'
* textShadowBlur
* textShadowOffsetX
* textShadowOffsetY

### textAlign = 'auto'

整体（包括 text 和 subtext）的水平对齐。

可选值：`'auto'`、`'left'`、`'right'`、`'center'`。

### textVerticalAlign = 'auto'

整体（包括 text 和 subtext）的垂直对齐。

可选值：`'auto'`、`'top'`、`'bottom'`、`'middle'`。

### left = 'auto'

标题（title）组件离容器左侧的距离。

`left` 的值可以是像 `20` 这样的具体像素值，可以是像 `'20%'` 这样相对于容器宽度的百分比，也可以是 `'left'`, `'center'`, `'right'`。

如果 `left` 的值为 `'left'`, `'center'`, `'right'`，组件会根据相应的位置自动对齐。

### top = 'auto'

标题（title）组件离容器上侧的距离。

`top` 的值可以是像 `20` 这样的具体像素值，可以是像 `'20%'` 这样相对于容器高度的百分比，也可以是 `'top'`, `'middle'`, `'bottom'`。

如果 `top` 的值为 `'top'`, `'middle'`, `'bottom'`，组件会根据相应的位置自动对齐。

### right = 'auto'

### bottom = 'auto'

###  padding = 5

标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。

###  backgroundColor = 'transparent'

标题背景色，默认透明。

###  borderColor = '#ccc'

标题的边框颜色。

###  borderWidth

标题的边框线宽。

### borderRadius

圆角半径，单位px，支持传入数组分别指定 4 个圆角半径。

## Toolbox

### show = true

### orient = 'horizontal'

工具栏 icon 的布局朝向。

可选：

- 'horizontal'
- 'vertical'

###  itemSize = 15

### showTitle = true

### feature

* saveAsImage
  * show = true
  * title = '保存为图片'
  * type = 'png'   `png`,`jpg`/`svg`
* restore
* dataView
  * readOnly

### iconStyle

公用的 icon 样式设置。由于 icon 的文本信息只在 icon hover 时候才显示，所以文字相关的配置项请在 `emphasis` 下设置。

* color = none   图形的颜色
* borderColor = #666    图形的描边颜色
* opacity = 1     图形透明度

### emphasis

* iconStyle
  * iconStyl属性
  *  textPosition = 'bottom'     文本位置，`'left'` / `'right'` / `'top'` / `'bottom'`
  * textFill = '#000'    文本颜色，如果未设定，则依次取图标 emphasis 时候的填充色、描边色，如果都不存在，则为 `'#000'`

## Tooltip



## legend

## Grid

`grid 组件` 是一个矩形容器，用于绘制二维直角坐标系（`cartesian2d`）

### show

### left = '10%'

`left` 的值可以是像 `20` 这样的具体像素值，可以是像 `'20%'` 这样相对于容器宽度的百分比，也可以是 `'left'`, `'center'`, `'right'`。

如果 `left` 的值为 `'left'`, `'center'`, `'right'`，组件会根据相应的位置自动对齐。

### top = 60

`top` 的值可以是像 `20` 这样的具体像素值，可以是像 `'20%'` 这样相对于容器高度的百分比，也可以是 `'top'`, `'middle'`, `'bottom'`。

如果 `top` 的值为 `'top'`, `'middle'`, `'bottom'`，组件会根据相应的位置自动对齐。

### right = '10%'

### bottom = 60

### width = 'auto'

直角坐标系（grid）组件的宽度。默认自适应。

`width` 的值可以是像 `20` 这样的具体像素值，可以是像 `'20%'` 这样相对于容器宽度的百分比。

### height = 'auto'

### containLabel

grid 区域是否包含坐标轴的[刻度标签](https://echarts.apache.org/zh/option.html#yAxis.axisLabel)。

- containLabel 为`false`的时候：
  - `grid.left` `grid.right` `grid.top` `grid.bottom` `grid.width` `grid.height` 决定的是由坐标轴形成的矩形的尺寸和位置。
  - 这比较适用于多个 `grid` 进行对齐的场景，因为往往多个 `grid` 对齐的时候，是依据坐标轴来对齐的。
- containLabel 为 `true`的时候：
  - `grid.left` `grid.right` `grid.top` `grid.bottom` `grid.width` `grid.height` 决定的是包括了坐标轴标签在内的所有内容所形成的矩形的位置。
  - 这常用于『防止标签溢出』的场景，标签溢出指的是，标签长度动态变化时，可能会溢出容器或者覆盖其他组件。

## xAxis

## yAxis

## Polar

极坐标系，可以用于散点图和折线图。每个极坐标系拥有一个角度轴和一个半径轴。

### center = ['50%', '50%']

极坐标系的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。

### radius 

极坐标系的半径。可以为如下类型：

- `number`：直接指定外半径值。
- `string`：例如，`'20%'`，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。

- `Array.<number|string>`：数组的第一项是内半径，第二项是外半径。

## radiusAxis

## angleAxis



## Series

































