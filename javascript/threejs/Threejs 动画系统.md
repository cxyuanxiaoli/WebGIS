# Threejs 动画系统

动画系统由许多组件组成，这些组件协同工作以创建动画、将它们附加到场景中的对象并控制它们。我们将它们分为两类，**动画创建**和**动画播放和控制**。

---

## 动画创建

创建动画涉及三个元素：

- 关键帧
- `KeyframeTrack`
- `AnimationClip`

### 关键帧

动画系统中最底层的概念级别是 **关键帧**。每个关键帧由三部分信息组成：

1. **time**
2. **property**
3. **value**

这三个关键帧分别描述了某个属性在特定时间的值。但是，**关键帧没有指定任何特定的对象**。如位置关键帧可用于为任何具有`.position`属性的对象设置动画。但是，关键帧确实指定了数据类型。目前，动画系统支持五种数据类型：

- Number
- Vector
- Quaternion
- Boolean
- String

要创建动画，我们至少需要两个关键帧。最简单的示例：

1. 在 0 秒 `.material.opacity`是 0
2. 在 3 秒 `.material.opacity`是 1

当我们使用这两个关键帧为对象设置动画时，它将在三秒内淡入视野。

THREEJS 中没有代表单个关键帧的类。相反，关键帧是存储在两个数组中的原始数据，`time`和`value`，如：

```js
const times = [0, 3];
const values = [0, 1];
```

### KeyframeTrack

在 `KeyframeTrack`中，将关键帧的`time`、`value`数据存储起来，并存储关键帧的`property`，例如`.position`、或`.material.opacity`。

与关键帧一样，`KeyframeTrack`不指定任何特定对象，一个`.material.opacity`可以为任何支持不透明度的材质设置动画。

`KeyframeTrack`是基类，每种数据类型都有一个子类：

- `NumberKeyframeTrack`
- `VectorKeyframeTrack`
- `QuaternionKeyframeTrack`
- `BooleanKeyframeTrack`
- `StringKeyframeTrack`

示例：

```js
// 创建透明度关键帧轨迹
const times = [0, 1, 2, 3, 4];
const values = [0, 1, 0, 1, 0];
const opacityKF = new NumberKeyframeTrack(".material.opacity", times, values);
// 创建位置关键帧轨迹
const times2 = [0, 3, 6];
const values2 = [0, 0, 0, 2, 2, 2, 0, 0, 0];
const positionKF = new VectorKeyframeTrack(".position", times2, values2);
```

### AnimationClip

动画剪辑是附加到单个对象的任意数量的关键帧的集合，表示剪辑的类是 `AnimationClip`。

动画剪辑存储三部分信息：剪辑的名称、剪辑的长度，最后是组成剪辑的轨迹数组 (`KeyframeTrack Array`)。如果我们将长度设置为-1，轨迹数组将用于计算长度。

```js
const positionKF = new VectorKeyframeTrack(
  ".position",
  [0, 3, 6],
  [0, 0, 0, 2, 2, 2, 0, 0, 0]
);
const opacityKF = new NumberKeyframeTrack(
  ".material.opacity",
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 0, 1, 0, 1, 0]
);
const moveBlinkClip = new AnimationClip("move-n-blink", -1, [
  positionKF,
  opacityKF,
]);
```

`AnimationClip`仍然没有附加到任何特定对象，我们可以将我们创建的这个简单剪辑与任何具有`.position`和`.material.opacity`属性的对象一起使用。

## 动画播放和控制

现在，我们有一个简单的动画剪辑。下一步是将此剪辑附加到一个对象上，然后播放它。

`AnimationMixer`允许我们将静态对象转换为动画对象，`AnimationAction`将剪辑连接到对象并允许我们使用播放、暂停、循环、等操作。

### AnimationMixer

要使用动画系统为诸如网格之类的对象设置动画，我们必须将其连接到 `AnimationMixer`。

```js
const mesh = new Mesh();
const mixer = new AnimationMixer(mesh);
```

### AnimationAction

`AnimationAction`将动画对象连接到动画剪辑。类`AnimationAction`也是暂停、播放、循环和重置等控件所在的位置。

我们将使用 `AnimationMixer.clipAction`创建一个`AnimationAction`对象，它确保动画被混合器缓存。

```js
// 将模型连接到混合器，然后使用.clipAction创建一个动作 将动作的状态设置为正在播放
const action = mixer.clipAction(moveBlinkClip);
action.play();
```

虽然我们调用了`.play`，但动画还没有开始。我们仍然需要更新动画循环中的混合器

```js
const clock = new Clock();
function loop() {
  requestAnimationFrame(loop);
  const frameT = clock.getDelta();
  mixer.update(frameT);
}
loop();
```

假设一个模型可以跑和也可以跳。每个动画都将出现在一个单独的剪辑中，并且每个剪辑必须连接到一个动作。因此，就像**混合器和模型之间存在一对一的关系**一样，**动作和动画剪辑之间也存在一对一的关系**。

```js
const mixer = new AnimationMixer(humanModel);
const walkAction = mixer.clipAction(walkClip);
const jumpAction = mixer.clipAction(jumpClip);
```

`AnimationAction`包含控件允许混合两个剪辑、逐渐将剪辑减慢到停止、循环播放剪辑、反向播放或以不同的速度播放等等。

### 动画控制

`AnimationAction`相关属性和方法控制动画播放

1. 属性
   - enabled 值设为`false`时会禁用动作，默认值是`true`
   - loop 循环模式 (可以通过`setLoop`改变)，默认值是 `THREE.LoopRepeat`
   - paused 为`true`时通过将动作的有效时间比例改为 0 来使动作暂停执行，默认值是`false`
   - clampWhenFinished 值为`true`, 则动画将在最后一帧之后自动暂停，默认值为`false`
   - repetitions 动作过程动画剪辑执行的次数，可以通过`setLoop`修改，默认值是`Infinity`
   - time 动作开始的时间点 (单位是秒, 从 0 开始计时)
   - timeScale `time`的比例因子，值为 0 时会使动画暂停，为负数时动画会反向执行，默认值是 1
   - weight 动作的影响程度，0 (无影响)到 1（完全影响）之间的值可以用来混合多个动作，默认值是 1
2. 方法
   - play() 让混合器激活动作
   - reset() 重置动作
   - stop() 让混合器停止动作
