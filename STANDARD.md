
## HTML

### 缩进

- 使用一个制表符（两个空格）为一次缩进

### 单双引号

- 默认使用双引号

### 变量使用{{}}

- {{}}与变量之间空一格

<view>{{ user.name }}</view>

### 减少标签的使用和嵌套

- 尽可能避免无意义的标签嵌套，做到精简

### 静态样式与动态样式区分

- 动态样式可以写到style属性内
- 静态样式尽可能拆分写在wxss文件中

### 语义化

- 标签的选择做到语义化
- 标签的class命名做到语义化
- 避免简写命名
  - 例如：class="news-p"或者"p"这种

### 换行

- 标签内的属性很多的时候，建议换行（超过4个必须换行：4个及4个以上）

```html
<view
  wx:if="{{ type === 'spinner' }}"
  wx:for="item in 12"
  wx:key="index"
  class="van-loading__dot"
/>
```

## CSS样式规范

### 命名

class命名必须按照以下规范进行命名

- .block
  - 某个类
- .block__child
  - 某个类的子元素
- .block--modifier
  - 某个类的不同状态

```html
<ul class="news">
    <li class="news__item"></li>
    <li class="news__item"></li>
    <li class="news__item--active"></li>
<ul>
```

### 模块区分

- wxss代码中对应wxml做好一定的代码区分

```html
<div class="header">
    ...
</div>
<div class="content">
    ...
</div>
<div class="footer">
    ...
</div>
```

```css
/*---------- header begin ----------*/
.header {
    ...
}

/*---------- content begin ----------*/
.content {
    ...
}
/*---------- footer begin ----------*/
.footer {
    ...
}
```

### 状态样式，非模块、元素样式，提到最上面

```css
/**
 * action
 * 被选中的样式
 */
.action {
    ...
}
/*---------- header begin ----------*/
.header {
    ...
}

/*---------- content begin ----------*/
.content {
    ...
}
/*---------- footer begin ----------*/
.footer {
    ...
}
```

### 多个选择器指定样式时，每个选择器单独占用一行

```css
/* 不推荐 */
.block, .table {
    margin: 10px auto;
}

/* 推荐 */
.block,
.table {
    margin: 10px auto;
}
```

### 尽量使用简写

```css
/* 不推荐 */
.block {
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;
}

/* 推荐 */
.block {
    padding: 10px 20px;
}
```

### 颜色使用简写的16进制色值

```css
/* 不推荐 */
.block {
    background-color: #ffffff;
    color: #666666;
}

/* 推荐 */
.block {
    background-color: #fff;
    color: #666;
}
```

### 声明顺序规范（建议分块注释）

- 定位属性块
- 盒模型属性块
- 子元素的排版属性
- 视觉效果属性（背景色、边框等）
- 其他属性（动画、透明度等）

```css
/* 推荐示例 */
.block {
  /* Positioning */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  /* Box-model */
  display: block;
  float: right;
  width: 100px;
  height: 100px;

  /* Typography */
  font: normal 13px "Helvetica Neue", sans-serif;
  line-height: 1.5;
  color: #333;
  text-align: center;

  /* Visual */
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 3px;

  /* Misc */
  opacity: 1;
}
```

### 注释

- 避免简单的对当前类名的重申，而应该简短对功能进行描述

```css
/* 不推荐 */
/* block--red */
.block--red {
    border: 1px solid red;
    background-color: red;
}

/* 推荐 */
/* block--red block类的红色状态，边框、背景色为红色 */
.block--red {
    border: 1px solid red;
    background-color: red;
}
```

- 单行注释与多行注释区分

```css
/* 不推荐 */
/* block--red */
/* block类的红色状态，边框、背景色为红色 */
.block--red {
    border: 1px solid red;
    background-color: red;
}

/* 推荐 */
/**
 * block--red 
 * block类的红色状态，边框、背景色为红色
 */
.block--red {
    border: 1px solid red;
    background-color: red;
}
```


## JS规范

### 缩进

- 使用一个制表符（两个空格）表示一个缩进

```javascript
let x = 1;
let y = 2;
function add(a, b) {
    return a + b;
}
console.log(add(x, y));
```

### 分号

- 原则上表达式必须以分号结尾
  - 变量声明
  - 表达式
  - return
  - throw
  - break
  - continue
  - do-while
  - 闭包

```javascript
// 变量声明
let x = 1;

// 表达式
x++;

function count(a) {
    // do-while
    do {
        a++;
    } while (a < 10);

    // return 
    return a;
}
```

### 空格

推荐在以下场合中使用空格：

- 大括号前面留一个空格
- 条件控制语句的小括号前后各留一个空格
- function参数列表小括号后留一个空格（前不留以示与条件语句区分）
- function参数列表中逗号后留一个空格
- 运算符（“+”、“-”、“/”等）前后留空格
- 注释语句块内前后各预留一个空格

```javascript
// 这是注释
/* 注释语句块前后预留一个空格 */

// 函数小括号后留一个空格，多参数列表逗号后留一个空格
function totalCount(a, b) {
    let total = 0;

    // 循环条件小括号前后留一个空格
    for (let i = a; i < b; i++) {
        total += i;        
    }

    return total;
}

// 参数列表逗号后留一个空格
console.log(totalCount(1, 10));
```

### 空行

在代码中加入空行，可以提高代码的组织性和可读性，推荐在以下场合中使用空行：

- 函数块后
- 文件最后保留一个空行（版本记录优化）

```javascript
function totalCount(a, b) {
    let total = 0;
    // 代码块后空行
    for (let i = a; i < b; i++) {
        total += i;        
    }
    return total;
}

// 函数后空行

console.log(totalCount(1, 10));
// 文件最后空行
```

### 换行

- 代码块的大括号换行
- 函数调用后换行

```javascript
// 函数大括号换行
function test() {
   ... 
}

// 函数调用后换行
test();
test();
```

### 引号

- 使用单引号
- 变量拼接推荐使用模版字符串

```javascript
const name = 'Jack';
const age = 20;

const sayHello = function (name, age) {
    return `hello, i am ${name}, my age is ${age}`;
}
```

### 逗号

- 避免不必要的逗号
  - 数组的最后一位
  - 对象的最后一位
  - ...

```javascript
/* 不推荐 */
const obj = {
	name: 'name',
  age: 12,
}

/* 推荐 */
const obj = {
	name: 'name',
  age: 12
}
```

### 注释

1、单行注释

- 注释单独成行，并且上方预留一空行（首行除外）
- 双斜线后必须留一个空格
- 缩进与下一行代码保持一致
- 推荐使用 “// FIXME:” 标记问题
- 推荐使用 “// TODO:” 标记已有方案但是为实现的代码块

```javascript
// 变量声明(预留空格)
let a = 1;

function caculate() {
    // FIXME: 这儿不应该使用全局变量
    total = 0;

    return total;
}

function caculate(total) {
    // TODO: 须对total进行整型或浮点型验证
    total += 1;

    return total;
}
```

2、多行注释

最少三行“*”后跟一个空格，具体参照下方代码中的格式进行书写

建议以下情况使用：

- 难于理解的代码段
- 可能存在错误的代码段
- 浏览器特殊HACK代码
- 业务逻辑相关的代码注释

```javascript
/*
 * 这段代码完成了一个很复杂的功能，balabalabala...
 */
for (let i = 0; i < 10; i++) {
    ...
}
```

3、文档注释

各类标签 @param，@method等请参考useJSDoc以及JSDocGuide，建议在以下情况下使用：

- 所有常量
- 所有函数
- 所有类

```javascript
/**
 * @func 
 * @desc 一个多参数函数
 * @param {string} a - 参数a
 * @param {number} b=1 - 参数b默认值1
 * @param {string} c - 参数c有三种取值方式'green'\'red'\'blue'
 * @param {object} d - 参数d是一个对象
 * @param {string} d.x - 参数d的属性x
 * @param {number} d.y - 参数d的属性y
 * @param {number} e - 参数e是一个可选参数
 */
function multiFunc(a, b = 1, c, d, e) {
    ...
}
```

### 变量声明

- 使用const和let关键字声明变量，不要使用var
- 普通变量和函数命名统一采用小驼峰，类名使用大驼峰
- 常量/枚举全大写，使用下划线分词
- 构造函数，首字母大写
- 变量声明放在作用域顶部

```javascript
// const可用于声明常量和只读变量，常量全大写
const PI = 3.141592654;
const id = this.id

// let声明局部变量，小驼峰
let testVar = 1;

// 枚举类型（模拟）-全大写-下划线分词
const SEX_MODE = {
    MALE: 0,
    FEMALE: 1
}


// 类名-构造函数-首字母大写
class React {
    constructor() {
        ...
    }
    ...
}
```

### 条件判断及循环

- 能使用对象、数组、字符串所拥有的默认遍历函数解决的问题，尽量不要使用循环以及条件判断语句
- 对于超过3个以上的if - else if - else语句，使用switch case来替代
- 避免出现死循环

```javascript
let arr = [1, 2, 3];
for (let i = 0; i < arr.length; i++) {
    console.log(i);
}
// 可以直接使用数组默认遍历方法
arr.forEach((item) => {console.log(item)})；

if (color === 'green') {
    ...    
} else if (color === 'red') {
    ...
} else if (color === 'blue') {
    ...
}

// 可以写成
switch(color) {
    case 'green':
        ...
        break;
    case 'red'
        ...
        break;
    case 'blue':
        ...
        break;
    ...
}
```

### 比较运算符

- 使用全等判断
- 非空判断用简写

```javascript
let arr = [...];

// 使用全等判断
if (arr[0] === 'Hello World!') {
    ...
}

// 简写
if (arr.length) {
    ...
}
```

### 函数

- 使用箭头函数代替匿名函数的写法
- 必传参数放参数列表前部，可选参数放后面

```javascript
// 参数列表-默认值
function delay(callback, time = 1000) {
    //匿名函数 => 箭头函数
    setTimeout(() => {
        callback('delay');
    }, time);
}

// 必传参数放前面，可选参数放最后，解构获取相应参数
function setProfile(id, name, { alias, sex, age, ...otherOptions }) {
    ...
}
```

### 解构赋值及扩展运算符

- 使用结构赋值读取对象中的参数
- 使用解构赋值读取数组内容
- 使用扩展运算符进行数组复制等

```javascript
// 字面量创建数组
let arr = [1, 2, 3, 4, 5];

// 扩展运算符，数组复制
let arrSpec = [...arr];

// 解构获取数组元素内容
let [x, ...other] = arr;
```

### 函数式及面向对象

- 避免流程式编程，当前业务模块内的公共方法可以提取出来放到当前js文件的上部，在业务代码中调用
- 对于整个项目的公共方法（例如：时间格式化）等，应该提取到公共的utils文件夹中，方便其他同学统一调用

### async、await

- 异步方法建议封装成promise，方便同步调用，避免回调地狱

### 不必要的运算及空白代码

- 如果某个值是固定的，则不需要使用
  - 诸如 !this.xx.xx 来进行重新赋值
- 空白代码、内部无操作的代码删除
  - 例如：没有用到的生命周期等

### log代码及调试

- 原则上提交前删除所有console.log代码，保持线上代码整洁，需要做测试的时候再手动添加

## 图片管理

1、本地图片

- 本地图片在不影响展示的前提下提前做好一定的压缩处理
- 本地图片统一存放在src目录下的images文件夹中
- 本地图片命名格式： 模块 + ‘-’ + 功能
  - 例如：home-logo.jpg

2、图片链接

- 图片链接将域名抽离，方便后期维护

## vue语法

### class

- 对于依赖某变量来判断是否有某个class的判断语句
  - 避免写成 {{ true ? 'actived' : '' }}
  - 应该简写 {{ { actived: true } }}

### 组件抽象

- 当前模块可复用的组件，抽象至当前模块文件夹下的components文件夹内
- 公共复用组件，抽象至公共src目录下的components文件夹内
- 组件文件夹命名方式以 xxx-xxx 来命名，'-'连接
- 组件内的prop必须指定类型

### 公共方法提取

- 公共方法按类型分类提取至src目录下的utils文件夹下
- 命名方式以‘-’连接
- 公共方法若为计算、格式化类型的函数，建议写单元测试

### 公共样式提取

- 公共样式可提取至src目录下的style文件夹内

