# webGpu学习笔记

WebGL （ Web 图形库的缩写）是一种JavaScript API ，用于在任何兼容的Web 浏览器中渲染交互式 2D 和 3D 图形，而无需使用插件。

WebGL 与其他网络标准完全集成，允许 GPU 加速使用物理和图像处理和效果作为网页画布的一部分。WebGL 元素可以与其他HTML元素混合，并与页面或页面背景的其他部分合成。

WebGL 程序由用 JavaScript 编写的控制代码和用OpenGL ES 着色语言(GLSL ES)（一种类似于C或C++的语言）编写的着色器代码组成，并在计算机的图形处理单元(GPU)上执行。WebGL 由非营利组织Khronos Group设计和维护。

2022 年 2 月 9 日，Khronos Group 宣布 WebGL 2.0 支持所有主流浏览器。

**历史进步:**
**WebGL 1.0** 基于OpenGL ES 2.0并提供了一个用于 3D 图形的API。它使用HTML5 canvas 元素，并使用文档对象模型(DOM) 接口进行访问。

**WebGL 2.0** 基于OpenGL ES 3.0，保证了 WebGL 1.0 的许多可选扩展的可用性，并公开了新的 API。 自动内存管理由JavaScript隐式提供。与 OpenGL ES 2.0 一样，WebGL 没有在 OpenGL 1.0 中引入并在 OpenGL 3.0 中弃用的固定功能API。如果需要，此功能必须由最终开发人员通过提供着色器代码和在 JavaScript 中配置数据绑定来实现。WebGL 中的着色器直接用 GLSL 表示，并作为文本字符串传递给 WebGL API。WebGL 实现将这些着色器指令编译为 GPU 代码。为通过 API 发送的每个顶点和光栅化到屏幕的每个像素执行此代码。

**WebGpu** 由苹果webkit内核开发团队提出组建新的api标准。用于加速图形和计算的未来网络标准和JavaScript API的工作名称，旨在提供“现代 3D 图形和计算能力”。它由W3C GPU 与来自Apple、Mozilla、Microsoft、Google和其他公司的工程师一起为 Web Community Group开发。
与WebGL不同，WebGPU 不是任何现有原生 API 的直接端口。它基于Vulkan、Metal和Direct3D 12提供的 API ，旨在跨移动和桌面平台提供高性能。移动平台在创建WebGPUDevice需要现代图形 API 的对象时将受到限制（如上所述）。
Chromium团队于 2017 年初展示了名为 NXT 的第一个概念原型。
Google Chrome 开发团队将其命名为WebGL /2 JavaScript API 的“继任者”。

## 基础入门
这里我们以我webGL2为主要学习版本。毕竟webGpu还没有正式下放。
基础教学网站：https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-getting-webgl2.html

WebGL是在GPU上运行的。在GPU上运行的WebGL代码是以一对函数的形式，分别叫做点着色器(Vetex Shader)和片段着色器(Fragment Shader). 他们是用一种类似C++的强类型语言[GLSL](https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html)编写的。这一对函数组合被叫做程序(Program)。

点着色器的任务是计算点的的位置。基于函数输出的位置，WebGL能够栅格化(rasterize)不同种类的基本元素，如[点、线和三角形](https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-points-lines-triangles.html)。当栅格化这些基本元素的同时，也会调用第二种函数：片段着色器。它的任务就是计算当前正在绘制图形的每个像素的颜色。

几乎所有的WebGL API是为这些函数对的运行来[设置状态](https://webgl2fundamentals.org/webgl/lessons/resources/webgl-state-diagram.html)。你需要做的是：设置一堆状态，然后调用`gl.drawArrays`和`gl.drawElements`在GPU上运行你的着色器。

这些函数需要用到的任意数据都必须提供给GPU。 **着色器**有如下四种方法能够接收数据。

## 着色器
1.  属性(Attributes)，缓冲区(Buffers)和顶点数组(Vetex Arrays)
    
    缓存区以二进制数据形式的数组传给GPU。缓存区可以放任意数据，通常有位置，归一化参数，纹理坐标，顶点颜色等等
    
    属性用来指定数据如何从缓冲区获取并提供给顶点着色器。比如你可能将位置信息以3个32位的浮点数据存在缓存区中， 一个特定的属性包含的信息有：它来自哪个缓存区，它的数据类型(3个32位浮点数据)，在缓存区的起始偏移量，从一个位置到下一个位置有多少个字节等等。
    
    缓冲区并非随机访问的，而是将顶点着色器执行指定次数。每次执行时，都会从每个指定的缓冲区中提取下一个值并分配给一个属性。
    
    属性的状态收集到一个顶点数组对象（VAO）中，该状态作用在每个缓冲区，以及如何从这些缓冲区中提取数据。
    
2.  Uniforms
    
    Uniforms是在执行着色器程序前设置的全局变量
    
3.  纹理(Textures)
    
    纹理是能够在着色器程序中随机访问的数组数据。大多数情况下纹理存储图片数据，但它也用于包含颜色以为的数据。
    
4.  Varyings
    
    Varyings是一种从点着色器到片段着色器传递数据的方法。根据显示的内容如点，线或三角形， 顶点着色器在Varyings中设置的值，在运行片段着色器的时候会被解析。


**着色器是**使用 [OpenGL ES 着色语言](https://www.jianshu.com/p/68ee05d6106a)(**GLSL**) 编写的程序，它携带着绘制形状的顶点信息以及构造绘制在屏幕上像素的所需数据，换句话说，它负责记录着像素点的位置和颜色。

绘制 WebGL 时候有两种不同的着色器函数，**顶点着色器和片段着色器。**你需要通过用 GLSL 编写这些着色器，并将代码文本传递给 WebGL，使之在 GPU 执行时编译。顺便一提，顶点着色器和片段着色器的集合我们通常称之为**着色器程序。**

### OpenGL ES着色器语言
GLSL 使用标准的 C/C++ 语句集。
<span style="color: red;">如果想要绘制高级自定义图形，这里不能跳过！</span>
[openGL博主](https://www.jianshu.com/u/a97f4c6003a4)
Open GL ES 着色器语言是一种高级的图形编辑语言，主要特性：
1.  OpenGL ES着色器语言是一种高级的过程语言
2.  对顶点着色器，片元着色器使用的是同样的语言，不做区分
3.  基于C/C++的语法及流程控制
4.  完美支持向量与矩阵的各种操作
5.  拥有大量的内置函数来提供丰富的功能

OpenGL ES虽然是基于C/C++语法的，但是还是有很大的不同。该语言不支持double，byte，short，long，也取消了C中的union，enum，unsigned以及位运算。

#### 基本数据类型：
GLSL有三种基本数据类型：float，int，bool，还有由这三种数据类型组成的数组和结构体。int 的取值范围和C中的不同，在GLSL中，int的取值范围是16位精度。
```cpp
bool b；
int a = 15;
int b = 036;//0开头的字面常量为八进制
int c = 0x3D;//0x开头的字面常量为十六进制
float myFloat = 1.0;
float floatArray[4];
float a[4] = float[](1.0, 2.0, 3.0, 4.0);
float b[4] = float[4](1.0. 2.0, 3.0, 4.0);
```

#### 向量
GLSL中，向量可以看做是用同样类型的标量组成，其基本类型也分为bool，int和float三种。每个向量可以由2个，3个或者4个相同的标量组成：
|   向量类型  | 说明  |
|  ----  | ----  |
| vec2  | 包含2个浮点数的向量 |
| vec3  | 包含3个浮点数的向量 |
| vec4  | 包含4个浮点数的向量 |
| ivec2  | 包含了2个整数的向量 |
| ivec3  | 包含了3个整数的向量 |
| ivec4  | 包含了4个整数的向量 |
| bivec2  | 包含2个布尔数的向量 |
| bivec3  | 包含3个布尔数的向量 |
| bivec4  | 包含4个布尔数的向量 |

```cpp
vec2 v2;
ivec3 v3;
bvec4 v4;
```
向量在着色器代码的开发中十分重要，可以很方便的存储以及操作颜色，位置，纹理坐标等。
也可以单独访问向量中的某个分量，基本语法为< 向量名>.<分量名>。

-   将向量看做颜色时，可以使用r，g，b，a 4个分量名，分别代码红，绿，蓝，透明度
```cpp
aColor.r = 0.6;
aColor.g = 0,8;
```
-   将一个向量看做位置时。可以使用x，y，z，w等4个分量名，其分别代表x轴，y轴，z轴，向量的模
```cpp
    aPosition.x = 67.2;  
    aPosition.z = 34.5;
```
    
-   将一个向量看做纹理坐标时，可以使用s，t，p，q 4个分量名，其分别代表纹理坐标中的1维，2维，3维。

#### 矩阵

| 矩阵类型 | 说明|
|----|----|
|mat2|2x2的浮点数矩阵
| mat3 | 3x3 浮点数矩阵  
|mat4|4x4浮点数矩阵

OpenGL ES着色器语言中，矩阵是按列顺序组织的，也就是一个矩阵可以看做由几个列向量组成。例如，mat3就可以看做由3个vec3组成。

对于矩阵的访问，可以将矩阵作为列向量的数组来访问。如； matrix 为一个mat4，可以使用matrix[2]取到该矩阵的第三列，其为一个vec4；也可以使用matrix[2][2]取得第三列的向量的第三个分量，其为一个float。

GLSL类型转换非常严格，变量只能赋值给相同类型的其他变量或者与相同类型的变量进行计算。
```cpp
float myFloat1 = 1.0;
float myFloat2 = 1; // error: invalid type conversion
```
只能使用构造函数来完成类型转换。
```cpp
float f = 1.0；
bool b = bool(f);
float f1 = float(b);
```
同样，向量也可以使用构造器，向量构造器的参数传递有两种基本方法。
-   如果只为向量构造器提供一个标量参数，则该值涌来设置向量的所有值
    
-   如果提供了多个标量或者向量参数，则向量的值从左到右使用这些参数设置
    
    vec4 myVec4 = vec4(1.0); // {1.0, 1.0, 1.0, .10}  
    vec3 myVec3 = vec3(1.0, 1.0, 1.0); // {1.0, 1.0, 1.0}  
    vec3 temp = vec3(myVec3);
    
    vec2 myVec2 = vec2(myVec3); // {myVec3.x, myVec3.y}  
    myVec4 = vec4(myVec2, myVec3); // {myVec2.x, myVec2.y, myVec3.x, myVec3.y}
    
    float a[4]  = float[] (1.0, 2.0, 3.0, 4.0);  
    float b[]4 = float[4] (1.0. 2.0, 3.0, 4.0); // 数组构造器中的参数数量必须等于数组的大小  
    vec2 c[2]= vec2[2] (vec2(1.0), vec2(2.0));

#### 常量
GLSL中可以使用常量，常量是着色器语言中不变的值，在程序中不能被修改，声明常量时，需要加入const修饰符，并且常量在声明时必须初始化。
```cpp
const float zero = 0.0;
const mat4 myMat = mat4(1.0);
```
对于熟悉变量，一致变量以及一遍变量在声明的时候一定不能进行初始化。
```cpp
attribute floa angleSpan;
uniform int k;
varying vec3 position;
```
#### 结构
GLSL除了提供基本类型之外，还可以和C语言一样提供结构体。
```cpp
 struct fragStruct {
      vec4 color;
      float start;
      float end;
  } fragVar;  //定义了一个fragStruct的结构体类型和fragVar的结构体变量

fragVar = fragStruct(vec4(0.0, 1.0, 1.0, 1.0),    // color
                                  0.5,  // start
                                  2.0); // end
vec4 color = fragVar.color;
float start = fragVar.start;
float end = fragVar.end;
```

#### 混合选择
通过运算符“.”可以进行混合选择操作，在运算符“.” 之后列出一个向量中需要的各个分量的名称，就可以选择并重新排列这些分量。
```cpp
vec4 color = vec4(0.7,0.1,0.5,1.0);
vec3 temp = color.agb;//相当于拿一个向量（1.0,0.1,0。5）赋值给temp
vec4 tempL = color.aabb; // 相当于拿了一个向量（1.0,1.0,0.5,0.5)赋值给tempL
vec3 tempLL;
tempLL.grb = color.aab; // 对向量tempLL的3个分量赋值
```
#### 限定符
限定符中大部分用来修饰全局变量。

|限定符| 说明| 
|----|----|
|attribute |一般用于每个顶点都各不相同的量，如顶点位置，颜色，应用程序传递给顶点着色器，仅能用于顶点着色器 
|uniform |一般用于对同一组顶点组成的单个3D物体中所有顶点都相同的量，如当前光源位置 
|varying |用于从顶点着色器传递到片元着色器的量 
|const| 用于声明常量

##### attribute
attribute限定符为属性限定符，其修饰的变量用来接收渲染管线传递进顶点着色器的当前待处理顶点的各种属性。这些属性值每个顶点各自拥有独立的副本，用于描述顶点的各项特征，如顶点坐标，法向量，颜色，纹理坐标等。

用attribute限定符修饰的变量其是由宿主程序批量传入渲染管线的，管线进行基本处理后再传递给顶点着色器。数据中有多少个顶点，管线就调用多少次顶点着色器，每次将一个顶点的各种属性数据传递给顶点着色器中对应的attribute变量。因此，顶点着色器每次执行将完成对一个顶点各项数据的处理。

所以，attribute限定符只能用于顶点着色器中，且attribute限定符只能用来修饰浮点数标量，浮点数向量以及矩阵变量，不能用来修饰其他类型的变量。

```cpp
attribute vec3 aPosition; // 顶点位置
attribute vec3 aNormal; // 顶点法向量
```
##### uniform

uniform为一致变量限定符，一致变量指的是对于同一组顶点组成的单个3D物体中所有顶点都相同的量。uniform变量可以用在顶点着色器或片元着色器中，其支持用来修饰所有的基本数据类型。与属性变量类似，一致变量的值也是有宿主程序传入。

```cpp
uniform mat4 uMVPMatrix; // 总变换矩阵
uniform mat4 uMMatrix; // 变换矩阵
uniform vec3 uLightLocation; // 光源位置
```
##### varying

要想将顶点着色器中的信息传入到片元着色器中，则必须使用varying限定符。用varying修饰的全局变量又称易变变量，易变变量可以看成是顶点着色器以及片元着色器之间的动态接口，方便顶点着色器与片元着色器之间信息的传递。

工作原理：
![](20230222190409.png)

从图中可以看出来，首先顶点着色器在每一个顶点都对易变变量vPosition进行赋值，然后在片元着色器中接受易变变量vPosition的值时得到的并不是某个顶点的特定值，而是根据片元所在位置及图元中各个顶点的位置进行插值计算产生的值。

如图中，顶点1,2,3的vPosition的值所示，则插值后片元a的vPosition的值为vec3（1.45,2.06,0）。这个值是根据3个顶点对应的着色器给vPosition的赋值，三个顶点的位置及此片元的位置由管线插值计算所得。

#### 函数
和C语言一样，着色器也可以自定义函数，语法一样

但是在参数列表中，参数除了可以指定类型外，还可以指定用途：

-   in ：其修饰的参数为输入参数，仅供函数接收外界传入的值，函数不能修改。默认为它。按值传递
    
-   out：其修饰的参数为输出参数，在函数体中对输出参数赋值可以将值传递到调用其的外界变量中。对于输出参数，要注意的是在调用时不可以使用字面常量。该变量的值不被传入函数，函数返回使被修改。该变量的值不被传入函数
    
-   inout：其修饰的参数为输入输出参数，具有输入输出两种参数的功能，如果被修改，原参数会被修改。按引用传递。
    
    vec4 myFunc(inout float myFloat, out vec4 myVec4, mat4 myMat4);
    

注意：GLSL中的函数不能递归
##### 内建函数
GLSL中最强大的功能之一就是提供的内建函数，比如用dot来计算两个向量的点乘，用pow来计算标量的幂次

#### 精度限定符

精度限定符可以指定着色器变量的精度，变量可以声明为低、中、高精度，这些限定符允许编译器在比较低的范围和精度上进行计算，在较低的精度上，有些OpenGL ES实现在运行着色器时可能会更快，或者电源效率更高，当然这种性能的提升是以降低精度为代价的。

精度限定符的关键字是：lowp、mediump、highp

```cpp
highp vec4 position;
lowp vec4 color;
mediump float exption; 
```

可以设置变量的默认精度，如果变量声明时没有使用精度限定符，将会拥有该类型的默认精度，默认精度可以在顶点或者片段着色器的开头指定：

```cpp
precision highp float;
precision mediump int;
```

同时，在顶点着色器中，如果没有指定默认精度，int 和 float 值的默认精度都是highp，但是在片段着色器中，float没有默认的精度，每个着色器必须声明一个默认的float精度，或者为float变量手动指定精度。  
最后需要注意：指定的精度根据不同的实现有不同的范围和精度，具体的范围可以根据OpenGL ES 的API来获取，例如在PowerVR SGX GPU上，lowp float变量用10位表示，medium float用16位表示，而highp用32位来表示。

#### 内建变量
内建变量一般用来实现渲染管线固定功能部分与自定义顶点或片元着色器之间的信息交互。

内建变量分为两类，输入与输出变量。  
输入变量负责架构渲染管线中固定功能部分产生的信息传递进着色器  
输出变量负责将着色器产生的信息传递给渲染管线中固定功能部分。

顶点着色器中主要是输出变量，如：

-   gl_Position：顶点着色器从应用程序中获得原始顶点的位置数据，这些原始的顶点数据在顶点着色器中经过平移，选择，缩放等数学变换后，生成新的顶点位置。新的顶点位置通过在顶点着色器中写入 gl_Position传递到渲染管线的后继阶段继续处理。  
    gl_Position的类型是vec4，写入的顶点位置数据必须与其类型一致
    
-   gl_PointSize：顶点着色器中可以计算一个点的大小，并将其赋值给gl_PointSize（标量 float类型）以传递给渲染管线，默认为1.
    

片元着色器中的输入变量：

-   gl_FragCoord：vec4类型，含有当前片元相对于窗口位置的坐标值，x，y，z与1/w。其中，x，y分别为片元相对于窗口的二维坐标，z为该片元的深度。

---

知道这些信息后，就可以实践实践。我们先用一个特别简单的例子，画三角形：

先看效果：
![](20230222190759.png)

## 原生webGL写法
我们以了解为主，知道原理就行。后续可以使用封装好的三方库，更简单的设计图形。

![](webGL.png)
就流程而言，还是太过于复杂，我不喜欢。

**1.顶点着色器，片段着色器，就需要单独学习OpenGL语法，晦涩难懂。**
**2.矩阵计算，位置计算，浮点数转换等等一系列，很容易就混淆了。** 
**3.过于依赖缓冲器，几乎所有的配置项，都要构造新的缓冲器。难受极了**

## ☆常用库
推荐使用成熟的2D库和3D库，减少GLSL代码书写。不然要写死个人。。。

 <b style="color: red;">统一采用react框架学习，尤其是对于进阶内容而言。</b>

介绍几个常用库：
https://pixijs.io/
https://oasisengine.cn/
https://doc.babylonjs.com/
https://threejs.org/
后续会补充。。。

### 2D库
我们以 pixi.js 库为主，尽可能避免webgl原生写法。
#### pixijs库的框架

##### 系统拓扑
|主要组成|描述|
|----|----|
|渲染器@pixi/core|PixiJS 系统的核心是渲染器，它显示场景图并将其绘制到屏幕上。PixiJS 的默认渲染器是基于 WebGL 的。|
|容器@pixi/display|创建场景图的主要显示对象：要显示的可渲染对象树，例如精灵、图形和文本。有关更多详细信息，请参见[场景图。](https://pixijs.io/guides/basics/scene-graph.html)|
|装载机@pixi/loaders|加载器系统提供了用于异步加载图像和音频文件等资源的工具。|
|定时器@pixi/ticker|Tickers 提供基于时钟的周期性回调。您的游戏更新逻辑通常会响应每帧一次的滴答而运行。您可以同时使用多个代码。|
|应用@pixi/app| Application 是一个简单的帮助程序，它将 Loader、Ticker 和 Renderer 包装到一个方便易用的对象中。非常适合快速入门、制作原型和构建简单的项目。|
|交互事件@pixi/interaction| PixiJS 支持基于触摸和鼠标的交互——使对象可点击、触发悬停事件等。|
|辅助功能@pixi/accessibility|贯穿我们的显示系统的是一组丰富的工具，用于实现键盘和屏幕阅读器的可访问性。|

本框架工作流:

<span style="color: skyblue">1.装载机loaders：SourceImage > Loader > BaseTexture > Texture</span>

<span style="color: skyblue">2.容器display：style > Containers > Spritesheets  > Sprites == Guides </span>

<span style="color: skyblue">3.定时器Tickers：动画的主要来源 </span>

**interaction/accessibility 穿插其中**



##### filter过滤
简单讲，就是滤镜。
以下是 PixiJS 默认可用的过滤器列表。但是，有一个包含[更多过滤器的](https://github.com/pixijs/filters)社区存储库。
[阿尔法过滤器](https://pixijs.download/release/docs/PIXI.filters.AlphaFilter.html)  
`@pixi/filter-alpha`
类似于设置`alpha`属性，但将 Container 展平而不是单独应用于子项。

[模糊滤镜](https://pixijs.download/release/docs/PIXI.filters.BlurFilter.html)  
`@pixi/filter-blur`
应用模糊效果

[颜色矩阵过滤器](https://pixijs.download/release/docs/PIXI.filters.ColorMatrixFilter.html)  
`@pixi/filter-color-matrix`
颜色矩阵是应用更复杂的色调或颜色变换（例如棕褐色调）的灵活方式。

[位移过滤器](https://pixijs.download/release/docs/PIXI.filters.DisplacementFilter.html)  
`@pixi/filter-displacement`
置换贴图创建视觉偏移像素，例如创建波浪水效果。

[FXAA过滤器](https://pixijs.download/release/docs/PIXI.filters.FXAAFilter.html)  
`@pixi/filter-fxaa`
基本 FXAA（快速近似抗锯齿）创建平滑效果。

[噪声滤波器](https://pixijs.download/release/docs/PIXI.filters.NoiseFilter.html)  
`@pixi/filter-noise`
创建随机噪声（例如，颗粒效应）。





##### DisplayObject对象
是引擎可以呈现的任何内容的核心类。它是精灵、文本、复杂图形、容器等的基类，并为这些对象提供许多通用功能。 通过操作精灵，文本，容器，遮盖等基类，实现很多动画效果。
|接口|描述|
|----|----|
|**position**|X 和 Y 位置以像素为单位给出，并改变对象相对于其父对象的位置，也可以直接用作`object.x`/`object.y`|
|**rotation**|旋转以弧度指定，顺时针旋转对象 (0.0 - 2 * Math.PI)|
|**angle**|角度是以度而不是弧度指定的旋转的别名 (0.0 - 360.0)|
|**pivot**|对象旋转的点，以像素为单位 - 也为子对象设置原点|
|**alpha**|不透明度从0.0（完全透明）到1.0（完全不透明），由孩子继承|
|**scale**|比例指定为百分比，其中 1.0 为 100% 或实际大小，并且可以为 x 和 y 轴独立设置|
|**skew**|	Skew 类似于 CSS skew() 函数，在 x 和 y 方向变换对象，并以弧度指定|
|**visible**|对象是否可见，作为布尔值 - 防止更新和渲染对象和子对象|
|**renderable**|对象是否应该被渲染 - 当 时`false`，对象仍然会被更新，但不会被渲染，不影响孩子|
 

##### 纹理
在 PixiJS 中，纹理是显示对象使用的核心资源之一。从广义上讲，纹理表示用于填充屏幕区域的像素源。最简单的例子是精灵——一个完全由单一纹理填充的矩形。
让我们通过跟踪图像数据传输到屏幕的路径来检查纹理的真正工作原理。
这是我们要遵循的流程：Source Image > Loader > BaseTexture > Texture


###### Loader加载图像
要使用图像，第一步是将图像文件从您的网络服务器拉到用户的网络浏览器中。为此，我们可以使用`PIXI.Texture.from()`，它适用于快速演示，但在生产中您将使用 Loader 类。
Loader 包装和管理使用`<IMG>`元素告诉浏览器获取图像，然后在完成时通知您。这个过程是_异步的_——您请求加载，然后时间过去，然后触发一个事件让您知道加载已完成。

流程：
```
1.  显示加载图像
2.  创建加载程序
3.  运行所有基于纹理的对象，将它们的纹理添加到加载程序
4.  启动加载程序，并可选择根据进度回调更新加载图像
5.  加载程序完成后，运行所有对象并用于`PIXI.Texture.from()`将加载的纹理从纹理缓存中拉出
6.  准备你的纹理（可选 - 见下文）
7.  隐藏您的加载图像，开始渲染您的场景图
```
即使在加载纹理之后，图像仍需要推送到 GPU 并进行解码。对大量源图像执行此操作可能会很慢，并且会在您的项目首次加载时导致延迟峰值。要解决这个问题，您可以使用[Prepare](https://pixijs.download/release/docs/PIXI.Prepare.html)插件，它允许您在显示项目之前的最后一步预加载纹理。
```
import { Application, Graphics } from 'pixi.js';
 
 // 创建实例
 const app = new Application();
 document.body.appendChild(app.view);
 // 停止渲染器
 app.stop();


 // 创建遮罩对象
 const rect = new Graphics()
     .beginFill(0x00ff00)
     .drawRect(40, 40, 200, 200);

 // 添加到舞台
 app.stage.addChild(rect);

 // 在资源加载完毕后，在开始渲染图形
 app.renderer.prepare.upload(app.stage, () => {
     app.start();
 });


// 过场动画，可以卸载纹理
PIXI.utils.destroyTextureCache()
```

###### BaseTextures纹理的基类

一旦加载器完成它的工作，加载的`<IMG>`元素就会包含我们需要的像素数据。但是要使用它来渲染某些东西，PixiJS 必须获取原始图像文件并将其上传到 GPU。这将我们带到了纹理系统的真正主力——BaseTexture[类](https://pixijs.download/release/docs/PIXI.BaseTexture.html)。
每个 BaseTexture 管理一个像素源——通常是图像，但也可以是 Canvas 或 Video 元素。BaseTextures 允许 PixiJS 将图像转换为像素并在渲染中使用这些像素。此外，它还包含控制纹理数据渲染方式的设置，例如环绕模式（用于 0.0-1.0 范围之外的 UV 坐标）和缩放模式（缩放纹理时使用）。
BaseTexture 会自动缓存，因此`PIXI.Texture.from()`重复调用同一 URL 每次都会返回相同的 BaseTexture。销毁 BaseTexture 会释放与其关联的图像数据。

**超越图像的素材限制**

不仅仅是图像来制作纹理:
视频：将 HTML5 VIDEO元素传递给以PIXI.BaseTexture.from()允许您在项目中显示视频。由于它是一种纹理，您可以对其进行着色、添加滤镜，甚至将其应用于自定义几何体。

Canvas：同样，您可以将 HTML5 CANVAS元素包装在 BaseTexture 中，让您使用 canvas 的绘图方法动态创建纹理。

SVG：传入一个SVG元素或加载一个 .svg URL，PixiJS 将尝试对其进行栅格化。对于网络高度受限的项目，这可以以最短的网络加载时间获得精美的图形。

RenderTexture：一个更高级（但非常强大！）的功能是从RenderTexture构建纹理。这可以允许使用Geometry对象构建复杂的几何体，然后将该几何体烘焙成简单的纹理。
这些纹理源中的每一个都有我们无法在本指南中涵盖的注意事项和细微差别，但它们应该让您感受到 PixiJS 纹理系统的强大功能。

```js
const app = new PIXI.Application({ background: "#1099bb" });

    document.body.appendChild(app.view);

  

    const container = new PIXI.Container();

    app.stage.addChild(container);

  

    // 纹理

    const texture = PIXI.Texture.from(

      "https://pixijs.io/guides/static/images/sample.png"

    );

  

    for (let i = 0; i < 2; i++) {

      const bunny = new PIXI.Sprite(texture);

      bunny.x = (i % 5) * 30;

      bunny.y = Math.floor(i / 5) * 30;

      bunny.rotation = Math.random() * (Math.PI * 2);

      container.addChild(bunny);

    }

  

    // 基础纹理

    const brt = new PIXI.BaseRenderTexture(

      // 宽度

      300,

      // 高度

      300,

      // 缩放模式，平滑缩放

      PIXI.SCALE_MODES.LINEAR,

      // 像素比

      1

    );

    // 基础

    const rt = new PIXI.RenderTexture(brt);

    const sprite = new PIXI.Sprite(rt);

  

    sprite.x = 450;

    sprite.y = 60;

    app.stage.addChild(sprite);

  

    /*

     * 这里就是手动渲染

     */

    container.x = 100;

    container.y = 60;

  

    app.ticker.add(() => {

      app.renderer.render(container, rt);

    });

```
###### Graphics图形
除了可以当遮罩之外，还可以创造图形，可以使用内置图形，也可以自定义参数。
```js
// antialias开启抗锯齿

    const app = new PIXI.Application({ antialias: true });

    document.body.appendChild(app.view);

  

    const graphics = new PIXI.Graphics();

  

    // Rectangle 矩形

    // graphics.beginFill(0xde3249);

    // graphics.drawRect(50, 50, 100, 100);

    // graphics.endFill();

  

    // // Rectangle + line style 1

    // graphics.lineStyle(2, 0xfeeb77, 1);

    // graphics.beginFill(0x650a5a);

    // graphics.drawRect(200, 50, 100, 100);

    // graphics.endFill();

  

    // // Rectangle + line style 2

    // graphics.lineStyle(10, 0xffbd01, 1);

    // graphics.beginFill(0xc34288);

    // graphics.drawRect(350, 50, 100, 100);

    // graphics.endFill();

  

    // // Rectangle 2

    // graphics.lineStyle(2, 0xffffff, 1);

    // graphics.beginFill(0xaa4f08);

    // graphics.drawRect(530, 50, 140, 100);

    // graphics.endFill();

  

    // // Circle 圆形

    // graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline

    // graphics.beginFill(0xde3249, 1);

    // graphics.drawCircle(100, 250, 50);

    // graphics.endFill();

  

    // // Circle + line style 1

    // graphics.lineStyle(2, 0xfeeb77, 1);

    // graphics.beginFill(0x650a5a, 1);

    // graphics.drawCircle(250, 250, 50);

    // graphics.endFill();

  

    // // Circle + line style 2

    // graphics.lineStyle(10, 0xffbd01, 1);

    // graphics.beginFill(0xc34288, 1);

    // graphics.drawCircle(400, 250, 50);

    // graphics.endFill();

  

    // // Ellipse + line style 2 椭圆

    // graphics.lineStyle(2, 0xffffff, 1);

    // graphics.beginFill(0xaa4f08, 1);

    // graphics.drawEllipse(600, 250, 80, 50);

    // graphics.endFill();

  

    // // draw a shape

    // graphics.beginFill(0xff3300);

    // graphics.lineStyle(4, 0xffd900, 1);

    // graphics.moveTo(50, 350);

    // graphics.lineTo(250, 350);

    // graphics.lineTo(100, 400);

    // graphics.lineTo(50, 350);

    // graphics.closePath();

    // graphics.endFill();

  

    // // draw a rounded rectangle

    // graphics.lineStyle(2, 0xff00ff, 1);

    // graphics.beginFill(0x650a5a, 0.25);

    // graphics.drawRoundedRect(50, 440, 100, 100, 16);

    // graphics.endFill();

  

    // // draw star

    // graphics.lineStyle(2, 0xffffff);

    // graphics.beginFill(0x35cc5a, 1);

    // graphics.drawStar(360, 370, 5, 50);

    // graphics.endFill();

  

    // // draw star 2

    // graphics.lineStyle(2, 0xffffff);

    // graphics.beginFill(0xffcc5a, 1);

    // graphics.drawStar(280, 510, 7, 50);

    // graphics.endFill();

  

    // // draw star 3

    // graphics.lineStyle(4, 0xffffff);

    // graphics.beginFill(0x55335a, 1);

    // graphics.drawStar(470, 450, 4, 50);

    // graphics.endFill();

  

    // 多边形

    const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

  

    // 线样式

    graphics.lineStyle(0);

    // 填充颜色

    graphics.beginFill(0x3500fa, 1);

    // 坐标点位置，

    graphics.drawPolygon(path);

    graphics.endFill();

  

    app.stage.addChild(graphics);

```


图形的复用：
```js
    // antialias开启抗锯齿

    const app = new PIXI.Application({ antialias: true });

    document.body.appendChild(app.view);

    // 创建一个模板

    let template = new PIXI.Graphics();

    // Add a circle

    template.beginFill(0x3500fa, 1);

    template.drawCircle(100, 100, 50);

    for (let i = 0; i < 5; i++) {

      // 这里就是可复用了

      let duplicate = new PIXI.Graphics(template.geometry);

      duplicate.position.x = i * 40;

      duplicate.position.y = i * 40;

      app.stage.addChild(duplicate);      

    }
```
图形的遮罩:
```js
    // 实例化

    const app = new PIXI.Application({ antialias: true });

    document.body.appendChild(app.view);

  

    // 开启交互, 说白了监听事件

    app.stage.interactive = true;

    // 加载纹理

    const bg = PIXI.Sprite.from("https://pixijs.io/examples/examples/assets/bg_rotate.jpg");

  

    // 定位

    bg.anchor.set(0.5);

  

    // 背景图片位置

    bg.x = app.screen.width / 2;

    bg.y = app.screen.height / 2;

  

    // 加入背景

    app.stage.addChild(bg);

    // 创建容器，赋予初始位置

    const container = new PIXI.Container();

    container.x = app.screen.width / 2;

    container.y = app.screen.height / 2;

  

    const bgFront = PIXI.Sprite.from("https://pixijs.io/examples/examples/assets/bg_scene_rotate.jpg");

    bgFront.anchor.set(0.5);

  

    const light2 = PIXI.Sprite.from("https://pixijs.io/examples/examples/assets/light_rotate_2.png");

    light2.anchor.set(0.5);

  

    const light1 = PIXI.Sprite.from("https://pixijs.io/examples/examples/assets/light_rotate_1.png");

    light1.anchor.set(0.5);

  

    const panda = PIXI.Sprite.from("https://pixijs.io/examples/examples/assets/panda.png");

    panda.anchor.set(0.5);

  

    // 可以批量加入容器

    container.addChild(bgFront, light2, light1, panda);

    // 将容器加入舞台

    app.stage.addChild(container);

  

    // 创建一个运动图形

    const thing = new PIXI.Graphics();

    // 加入舞台

    app.stage.addChild(thing);

    thing.x = app.screen.width / 2;

    thing.y = app.screen.height / 2;

    thing.lineStyle(0);

  

    // 容器的遮罩是thing

    container.mask = thing;

  

    let count = 0;

  

    // 监听鼠标

    app.stage.on("pointertap", () => {

      if (!container.mask) {

        // 遮罩层是否存在

        container.mask = thing;

      } else {

        container.mask = null;

      }

    });

  
  

    // 提示写死了

    const help = new PIXI.Text("Click or tap to turn masking on / off.", {

      fontFamily: "Arial",

      fontSize: 12,

      fontWeight: "bold",

      fill: "white",

    });

    help.y = app.screen.height - 26;

    help.x = 10;

    app.stage.addChild(help);

  
  

    // 添加定时器

    app.ticker.add(() => {

      bg.rotation += 0.01;

      bgFront.rotation -= 0.01;

  

      light1.rotation += 0.02;

      light2.rotation += 0.01;

  

      panda.scale.x = 1 + Math.sin(count) * 0.04;

      panda.scale.y = 1 + Math.cos(count) * 0.04;

  

      count += 0.1;

  

      thing.clear();

  

      thing.beginFill(0x8bc5ff, 0.4);

      thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);

      thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);

      thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);

      thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);

      thing.rotation = count * 0.1;

    });
```
###### Events启动事件交互
全部事件 https://pixijs.download/release/docs/PIXI.AnimatedSprite.html
和DOM类似的绑定方法，凡是DisplayObject的派生对象，都可以绑定。但事件传播不会冒泡和捕获。
```js
let sprite = PIXI.Sprite.from('/some/texture.png');
sprite.on('pointerdown', (event) => { alert('clicked!'); });
```

**命中测试**
更精准的触发事件，精确交互，防止误触。说白了，就是构建描边数组hitArea
```js
    const starButton4 = new PIXI.Sprite(yellowStar);

    starButton4.position.set(600, 200);

    const squareMask2 = new PIXI.Graphics()

      .beginFill(0xffffff)

      .drawRect(starButton4.x, starButton4.y, 75, 200)

      .endFill();

    starButton4.mask = squareMask2;

  

    // 多边形描边
    starButton4.hitArea = new PIXI.Polygon([

      80, 0, 100, 50, 160, 55, 115, 95, 130, 150, 80, 120, 30, 150, 45, 95, 0,

      55, 60, 50,

    ]);

    starButton4.buttonMode = true;

    starButton4.interactive = true;

  

    starButton4.on("pointerdown", (event) => onClick(starButton4));

  

    starButton4.on("pointerover", (event) => onPointerOver(starButton4));

  

    starButton4.on("pointerout", (event) => onPointerOut(starButton4));
```

**注意事项**
使用容器，杜绝事件树泛滥。
命中测试需要遍历完整的对象树，这在复杂的项目中可能成为优化瓶颈。为了缓解这个问题，PixiJS 容器派生对象有一个名为`interactiveChildren`. 如果您的容器或其他对象具有您知道永远不会交互的复杂子树，则可以将此属性设置为，`false`命中测试算法将在检查悬停和单击事件时跳过这些子树。例如，如果您正在构建横向卷轴游戏，您可能希望`background.interactiveChildren = false`为背景层设置岩石、云彩、花朵等。由于无法点击的子对象的数量，这样做会大大加快命中测试的速度背景层将包含。

###### ticker渲染循环
任何 PixiJS 项目的大部分都包含在这个更新 + 渲染周期中。您编写更新代码，PixiJS 处理渲染。

1.运行代码回调
第一步是计算自上一帧以来经过了多长时间，然后使用该时间增量调用 Application 对象的代码回调。这允许您的项目代码为舞台上的精灵等设置动画和更新，为渲染做准备。

2.更新场景图
这些对象处于树状层次结构中。通过移动、旋转等更新游戏对象后，PixiJS 需要计算场景中每个对象的新位置和状态，然后才能开始绘制。

3.渲染场景图
渲染系统从场景图的根节点 ( `app.stage`) 开始，开始渲染每个对象及其子对象，直到绘制完所有对象。这个过程中没有剔除或其他技巧。如果在舞台的可见部分之外有很多对象，您需要研究将它们禁用作为一种优化。

4.帧率
可以设置，也可以自动。
关于帧速率的注释。渲染循环不能无限快地运行——将东西绘制到屏幕上需要时间。此外，每次屏幕更新（通常为 60fps，但较新的显示器可以支持 144fps 及以上）更新帧不止一次通常没有用。最后，PixiJS 在 Chrome 或 Firefox 等网络浏览器的上下文中运行。浏览器本身必须平衡各种内部操作的需求与服务任何打开的选项卡。综上所述，确定何时绘制框架是一个复杂的问题。
在您想要调整该行为的情况下，您可以在 Ticker 上设置`minFPS`和`maxFPS`属性，以向 PixiJS 提示您要支持的滴答速度范围。请注意，由于环境复杂，您的项目无法_保证_给定的 FPS。`delta`在代码回调中使用传递的值来缩放任何动画以确保流畅播放。

5.自定义渲染循环
还有许多其他创建渲染循环的方法可能对寻求解决给定问题的高级用户有帮助。 在制作原型和学习 PixiJS 时，推荐使用应用程序提供的系统。

###### scene-graph场景图
每一帧，PixiJS 都会更新并渲染场景图。让我们谈谈场景图中的内容，以及它如何影响您开发项目的方式。如果您以前构建过游戏，这一切听起来应该非常熟悉，但如果您来自 HTML 和 DOM，那么在我们进入您可以渲染的特定类型的对象之前了解它是值得的。

**一颗树**
场景图的根节点是由应用程序维护的容器，并用 引用`app.stage`。当您将 sprite 或其他可渲染对象作为子级添加到舞台时，它会添加到场景图中并将被渲染和交互。大多数 PixiJS 对象也可以有子对象，因此当您构建更复杂的场景时，您最终会得到一个植根于应用程序阶段的父子关系树。

**父母和子女**
有点层级样式的感觉了。

当父母移动时，它的孩子也会移动。当父母旋转时，它的孩子也会旋转。隐藏父项，子项也将被隐藏。如果您有一个由多个精灵组成的游戏对象，您可以将它们收集在一个容器下，将它们视为世界中的单个对象，作为一个整体移动和旋转。

每一帧，PixiJS 都会从根向下遍历场景图，通过所有子对象到叶子，计算每个对象的最终位置、旋转、可见性、透明度等。如果父对象的 alpha 设置为 0.5（使其透明 50%） ，它的所有子项也将从 50% 透明度开始。如果一个孩子然后设置为 0.5 alpha，它不会是 50% 透明，它将是 0.5 x 0.5 = 0.25 alpha，或 75% 透明。类似地，一个对象的位置是相对于它的父对象的，所以如果父对象的 x 位置设置为 50 像素，而子对象的 x 位置设置为 100 像素，它将以 150 像素的屏幕偏移绘制，或 50 + 100。

```js
// Create the application helper and add its render target to the page

    const app = new PIXI.Application({ width: 640, height: 360 });

    document.body.appendChild(app.view);

  

    // Add a container to center our sprite stack on the page

    const container = new PIXI.Container();

    container.x = app.screen.width / 2;

    container.y = app.screen.height / 2;

    app.stage.addChild(container);

  

    // Create the 3 sprites, each a child of the last

    const sprites = [];

    let parent = container;

    for (let i = 0; i < 3; i++) {

      let sprite = PIXI.Sprite.from("assets/images/sample.png");

      sprite.anchor.set(0.5);

      parent.addChild(sprite);

      sprites.push(sprite);

      parent = sprite;

    }

  

    // Set all sprite's properties to the same value, animated over time

    let elapsed = 0.0;

    app.ticker.add((delta) => {

      elapsed += delta / 60;

      const amount = Math.sin(elapsed);

      const scale = 1.0 + 0.25 * amount;

      const alpha = 0.75 + 0.25 * amount;

      const angle = 40 * amount;

      const x = 75 * amount;

      for (let i = 0; i < sprites.length; i++) {

        const sprite = sprites[i];

        sprite.scale.set(scale);

        sprite.alpha = alpha;

        sprite.angle = angle;

        sprite.x = x;

      }

    });
```

场景图中任何给定节点的累积平移、旋转、缩放和倾斜存储在对象的`worldTransform`属性中。同样，累积 alpha 值存储在`worldAlpha`属性中。

**渲染顺序**
所以我们要画一棵事物树。谁先抽到？
PixiJS 从根向下渲染树。在每一层，当前对象被渲染，然后每个子对象按照插入的顺序被渲染。所以第二个孩子渲染在第一个孩子之上，第三个渲染在第二个之上。

```js
    // 创建实例

    const app = new PIXI.Application({ width: 640, height: 360 });

    document.body.appendChild(app.view);

  

    // 标题文字

    const label = new PIXI.Text(

      "Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D",

      { fill: "#ffffff" }

    );

    label.position = { x: 300, y: 100 };

    app.stage.addChild(label);

  

    // 封装

    const letters = [];

    function addLetter(letter, parent, color, pos) {

      // 方块

      const bg = new PIXI.Sprite(PIXI.Texture.WHITE);

      bg.width = 100;

      bg.height = 100;

      bg.tint = color;

      // 方块中的文字

      const text = new PIXI.Text(letter, { fill: "#ffffff" });

      text.anchor.set(0.5);

      text.position = { x: 50, y: 50 };

  

      // 将方块和文字封装在容器中

      const container = new PIXI.Container();

      container.position = pos;

      container.visible = false;

      container.addChild(bg, text);

      parent.addChild(container);

  

      letters.push(container);

      return container;

    }

  

    // 定义四个容器

    let a = addLetter("A", app.stage, 0xff0000, { x: 100, y: 100 });

    let b = addLetter("B", a, 0x00ff00, { x: 20, y: 20 });

    let c = addLetter("C", a, 0x0000ff, { x: 20, y: 40 });

    let d = addLetter("D", app.stage, 0xff8800, { x: 140, y: 100 });

  

    // 随之时间展示他们

    let elapsed = 0.0;

    app.ticker.add((delta) => {

      elapsed += delta / 60.0;

      if (elapsed >= letters.length) {

        // 清零重置

        elapsed = 0.0;

      }

      for (let i = 0; i < letters.length; i++) {

        // 循环展示到第几个

        letters[i].visible = elapsed >= i;

      }

    });
```

如果您想重新排序子对象，您可以使用`setChildIndex()`. 要在父母列表中的给定点添加孩子，请使用`addChildAt()`. `sortableChildren`最后，您可以使用该选项并结合设置`zIndex`每个子项的属性来启用对象子项的自动排序。

**剔除**
如果您正在构建一个项目，其中大部分 DisplayObject 都在屏幕外（例如，横向卷轴游戏），您将需要剔除_这些_对象。剔除是评估一个对象（或其子对象！）是否在屏幕上的过程，如果不在屏幕上，则关闭它的渲染。如果您不剔除屏幕外的对象，渲染器仍会绘制它们，即使它们的像素最终都没有出现在屏幕上。

PixiJS 不提供对视口剔除的内置支持，但您可以找到可能满足您需求的第 3 方插件。或者，如果您想构建自己的剔除系统，只需在每个 tick 期间运行您的对象并将`renderable`不需要绘制的任何对象设置为 false。

**本地与全球坐标**
如果您将精灵添加到舞台，默认情况下它会显示在屏幕的左上角。这就是 PixiJS 使用的全局坐标空间的原点。如果您的所有对象都是舞台的子对象，那么这是您唯一需要担心的坐标。但是一旦你引入了容器和孩子，事情就变得更加复杂了。[50, 100] 处的子对象距离_其父对象_右 50 像素，下 100 像素。

我们称这两个坐标系为“全局”和“局部”坐标。当您在一个对象上使用时`position.set(x, y)`，您总是在相对于该对象的父对象的局部坐标系中工作。

要从局部坐标转换为全局坐标，您可以使用该`toGlobal()`函数。这是一个示例用法：
```javascript
// Get the global position of an object, relative to the top-left of the screen
let globalPos = obj.toGlobal(new PIXI.Point(0,0));
```
此代码段将设置`globalPos`为子对象的全局坐标，相对于全局坐标系中的 [0, 0]。

**注意**
当您的项目与主机操作系统或浏览器一起工作时，会出现第三个坐标系 - “屏幕”坐标（又名“视口”坐标）。屏幕坐标表示相对于 PixiJS 渲染到的画布元素左上角的位置。DOM 和本机鼠标单击事件之类的东西在屏幕空间中工作。

现在，在许多情况下，屏幕空间等同于世界空间。如果画布的大小与创建 PIXI.Application 时指定的渲染视图的大小相同，就会出现这种情况。默认情况下，情况是这样的——例如，您将创建一个 800x600 的应用程序窗口并将其添加到您的 HTML 页面，它会保持该大小。世界坐标中的 100 个像素将等于屏幕空间中的 100 个像素。但！通常拉伸渲染视图以使其填满屏幕，或者以较低的分辨率渲染并提高速度。在那种情况下，canvas 元素的屏幕尺寸会改变（例如通过 CSS），但底层渲染视图不会_，_导致世界坐标和屏幕坐标不匹配。

###### sprites精灵

精灵是 PixiJS 中最简单和最常见的可渲染对象DisplayObject。它们代表要在屏幕上显示的单个图像。每个[Sprite](https://pixijs.download/release/docs/PIXI.Sprite.html)都包含一个要绘制的[纹理](https://pixijs.download/release/docs/PIXI.Texture.html)，以及在场景图中运行所需的所有变换和显示状态。

 **Alpha、色调和混合模式**

Alpha 是标准的显示对象属性。您可以使用它通过在一段时间内将每个精灵的 alpha 从 0.0 设置为 1.0 来使精灵淡入场景。

着色允许您将每个像素的颜色值乘以一种颜色。例如，如果您有一款地牢游戏，您可以通过设置 来显示角色的中毒状态`obj.tint = 0x00FF00`，这会为该角色赋予绿色调。

混合模式会更改渲染时将像素颜色添加到屏幕的方式。三种主要模式是**add**，它将每个像素的 RGB 通道添加到您的 sprite 下的任何内容（对发光和照明很有用），**multiply**其工作方式类似于`tint`，但基于每个像素，以及**screen**，它覆盖像素，使任何内容变亮在他们下面。

**比例与宽度和高度**
使用 sprite 时，一个常见的混淆领域在于缩放和尺寸。PIXI.DisplayObject 类允许您为任何对象设置 x 和 y 比例。作为 DisplayObjects 的精灵也支持缩放。然而，除此之外，Sprites 支持可用于实现相同效果的显式`width`和属性，但以像素而不是百分比为单位。`height`这是有效的，因为 Sprite 对象拥有一个纹理，它具有明确的宽度和高度。当您设置 Sprite 的宽度时，PixiJS 会在内部将该宽度转换为基础纹理宽度的百分比并更新对象的 x 比例。所以宽度和高度实际上只是更改比例的便捷方法，基于像素尺寸而不是百分比。

**枢轴与锚点**
如果您将精灵添加到舞台并旋转它，默认情况下它将围绕图像的左上角旋转。在某些情况下，这就是您想要的。然而，在许多情况下，您希望精灵围绕其包含的图像的中心或任意点旋转。

有两种方法可以实现这一点：_枢轴_和_锚点_

对象的**枢轴**是距 Sprite 左上角的偏移量，以像素表示。它默认为 (0, 0)。如果您有一个纹理为 100px x 50px 的 Sprite，并且想要将枢轴点设置为图像的中心，您可以将枢轴设置为 (50, 25) - 宽度的一半和高度的一半。请注意，枢轴可以设置在图像_外部_，这意味着枢轴可能小于零或大于宽度/高度。例如，这在设置复杂的动画层次结构时很有用。每个 DisplayObject 都有一个枢轴。

相比之下，anchor 仅适用于Sprites **。**锚点在每个维度中以百分比指定，从 0.0 到 1.0。要使用锚点围绕纹理的中心点旋转，您需要将 Sprite 的锚点设置为 (0.5, 0.5) - 50% 的宽度和高度。虽然不太常见，但锚点也可以在标准 0.0 - 1.0 范围之外。

锚点的好处在于它们与分辨率和维度无关。如果您将 Sprite 设置为锚定在中间然后稍后更改纹理的大小，您的对象仍然会正确旋转。如果您改为使用基于像素的计算来设置枢轴，则更改纹理大小将需要更改枢轴点。

所以，一般来说，您在使用 Sprites 时会希望使用锚点。

最后一点：与 CSS 不同，在 CSS 中设置图像的变换原点不会移动它，在 PixiJS 中设置锚点或枢轴_将_移动屏幕上的对象。换句话说，设置锚点或枢轴不仅会影响旋转原点，还会影响精灵相对于其父元素的位置。
```js
// 锚点
bunny.anchor.set(0.5);
// 位置
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
```
###### Spritesheets精灵表
spritesheet 的基本思想是将一系列图像打包成单个图像，跟踪每个源图像的结束位置，并将该组合图像用作生成的 Sprites 的共享 BaseTexture。

第一步是收集要组合的图像。然后精灵打包器收集图像，并创建一个新的组合图像。

在创建此图像时，构建它的工具会跟踪存储每个源图像的矩形的位置。然后它会用该信息写出一个 JSON 文件。

这两个文件可以组合在一起传递到 SpriteSheet 构造函数中。SpriteSheet 对象然后解析 JSON，并创建一系列 Texture 对象，每个源图像一个，根据 JSON 数据为每个对象设置源矩形。每个纹理都使用相同的共享 BaseTexture 作为其源。

**SpriteSheets 以两种方式帮助您的项目。**

首先，通过**加快加载过程**。虽然下载 SpriteSheet 的纹理需要移动相同（甚至更多！）的字节数，但它们被分组到一个文件中。这意味着用户的浏览器可以为相同数量的 Sprites 请求和下载更少的文件。文件数量_本身_是下载速度的关键驱动因素，因为每个请求都需要往返网络服务器，而浏览器对它们可以同时下载的文件数量有限制。将项目从单独的源图像转换为共享的 Sprite 表可以将下载时间缩短一半，而不会影响质量。

其次，通过**改进批量渲染**。WebGL 渲染速度大致与绘制调用的数量成比例。将多个 Sprites 等批处理到单个绘制调用中是 PixiJS 如何运行得如此快的主要秘诀。最大化批处理是一个复杂的主题，但是当多个 Sprites 都共享一个公共 BaseTexture 时，它​​们更有可能被一起批处理并在一次调用中渲染。

[ShoeBox](http://renderhjs.net/shoebox/)：ShoeBox 是一个免费的、基于 Adob​​e AIR 的 sprite 打包实用程序，非常适合小型项目或学习 SpriteSheets 的工作原理。

[TexturePacker](https://www.codeandweb.com/texturepacker)：TexturePacker 是一个更完善的工具，支持高级功能和工作流程。有一个免费版本可用，它具有为 PixiJS 打包 spritesheet 的所有必要功能。它非常适合大型项目和专业游戏开发，或者需要更复杂的图块映射功能的项目。

Spritesheet 数据也可以手动或以编程方式创建，并提供给新的 AnimatedSprite。如果您的精灵已经包含在单个图像中，这可能是一个更简单的选择。

```js
%% 例子 %%
  

    const app = new PIXI.Application(600, 600, { background: "#1099bb" });

    document.body.appendChild(app.view);

  

    // Create object to store sprite sheet data

        const atlasData = {

          frames: {

            enemy1: {

              frame: { x: 0, y:0, w:32, h:32 },

              sourceSize: { w: 32, h: 32 },

              spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }

            },

            enemy2: {

              frame: { x: 32, y:0, w:32, h:32 },

              sourceSize: { w: 32, h: 32 },

              spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }

            },

          },

          meta: {

            image: 'https://pixijs.io/examples/examples/assets/bunny.png',

            format: 'RGBA8888',

            size: { w: 128, h: 32 },

            scale: 1

          },

          animations: {

            enemy: ['enemy1','enemy2'] //array of frames by name

          }

        }

  
  

        // Create the SpriteSheet from data and image

        const spritesheet = new PIXI.Spritesheet(

          PIXI.BaseTexture.from(atlasData.meta.image),

          atlasData

        );

  

        // Generate all the Textures asynchronously

        await spritesheet.parse();

  

        // spritesheet is ready to use!

        const anim = new PIXI.AnimatedSprite(spritesheet.animations.enemy);

  

        // set the animation speed

        anim.animationSpeed = 0.1666;

  

        // play the animation on a loop

        anim.play();

  

        // add it to the stage to render

        app.stage.addChild(anim);
```
是一种提高性能的方法。
###### Text文本
无论是高分还是图表标签，文本通常是项目中传达信息的最佳方式。令人惊讶的是，使用 WebGL 在屏幕上绘制文本是一个非常复杂的过程——根本没有内置支持。PixiJS 提供的价值之一是隐藏了这种复杂性，允许您使用几行代码绘制不同样式、字体和颜色的文本。此外，这些文本位与 sprite 一样都是场景对象 - 您可以对文本进行着色、旋转、alpha 混合，以及像对待任何其他图形对象一样对待它。
由于在 WebGL 中处理文本的挑战，PixiJS 提供了两种截然不同的解决方案。在本指南中，我们将详细介绍这两种方法，以帮助您根据项目需求做出正确的选择。选择错误的文本类型会对项目的性能和外观产生很大的负面影响。

**一、简单文本**
```js
    const app = new PIXI.Application({ background: "#1099bb" });

    document.body.appendChild(app.view);

  

    const basicText = new PIXI.Text("Basic text in pixi");

    basicText.x = 50;

    basicText.y = 100;

  

    app.stage.addChild(basicText);

  

    const style = new PIXI.TextStyle({

      fontFamily: "Arial",

      fontSize: 36,

      fontStyle: "italic",

      fontWeight: "bold",

      fill: ["#ffffff", "#00ff99"], // gradient

      stroke: "#4a1850",

      strokeThickness: 5,

      dropShadow: true,

      dropShadowColor: "#000000",

      dropShadowBlur: 4,

      dropShadowAngle: Math.PI / 6,

      dropShadowDistance: 6,

      wordWrap: true,

      wordWrapWidth: 440,

      lineJoin: "round",

    });

  

    const richText = new PIXI.Text(

      "Rich text with a lot of options and across multiple lines",

      style

    );

    richText.x = 50;

    richText.y = 220;

  

    app.stage.addChild(richText);

  

    const skewStyle = new PIXI.TextStyle({

      // 文本风格

      fontFamily: "Arial",

      dropShadow: true,

      dropShadowAlpha: 0.8,

      dropShadowAngle: 2.1,

      dropShadowBlur: 4,

      dropShadowColor: "0x111111",

      dropShadowDistance: 10,

      fill: ["#ffffff"],

      stroke: "#004620",

      fontSize: 60,

      fontWeight: "lighter",

      lineJoin: "round",

      strokeThickness: 12,

    });

  

    const skewText = new PIXI.Text("SKEW IS COOL", skewStyle);

    skewText.skew.set(0.65, -0.3);

    skewText.anchor.set(0.5, 0.5);

    skewText.x = 300;

    skewText.y = 480;

  

    app.stage.addChild(skewText);
```

**文本样式**
有很多可用的文本样式选项（请参阅[TextStyle](https://pixijs.download/release/docs/PIXI.TextStyle.html)），但它们分为 5 个主要组：
**字体**：`fontFamily`选择要使用的网络字体，`fontSize`指定要绘制的文本的大小，以及字体粗细、样式和变体的选项。
**外观**：设置颜色`fill`或添加`stroke`轮廓，包括渐变填充选项。
**Drop-Shadows**：使用 设置阴影`dropShadow`，并提供一系列相关选项来指定偏移、模糊、不透明度等。
**Layout** : 启用 with `wordWrap`,`wordWrapWidth`然后自定义`lineHeight`and `align`or`letterSpacing`
**实用程序**：如果需要，添加`padding`或`trim`额外空间来处理时髦的字体系列。

**加载和使用特殊字体**
为了让 PixiJS 构建 PIXI.Text 对象，您需要确保浏览器加载了您要使用的字体。不幸的是，在撰写本文时，PIXI.Loader 系统不支持加载字体文件，因此您需要使用第 3 方字体加载器来确保预加载您要使用的任何自定义 Web 字体。在项目的 CSS 中添加 @font-face 声明是不够的，因为浏览器会在加载自定义字体时愉快地使用后备字体呈现文本。

任何可以加载网络字体的 javascript 库都可以工作，您只需要一些可以延迟启动项目直到浏览器完全加载字体的东西。

一个这样的库是[FontFaceObserver](https://fontfaceobserver.com/)。这是一个简单的示例，展示了如何使用它来确保在您的应用程序启动之前加载 Web 字体“Short Stack”。首先，我们需要在 CSS 中声明字体：

```css
@font-face {
  font-family: Short Stack;
  src: url(short-stack.woff2) format('woff2'),
       url(short-stack.woff) format('woff');
}
```

现在浏览器知道我们的字体是什么以及如何找到源文件，是时候使用库来加载它们了：

```javascript
// Create the loader
let font = new FontFaceObserver('Short Stack', {});
// Start loading the font
font.load().then(() => {
  // Successful load, start up your PixiJS app as usual
  let app = new PIXI.Application({ width: 640, height: 360 });
  document.body.appendChild(app.view);
  // ... etc ...

}, () => {
  // Failed load, log the error or display a message to the user
  alert('Unable to load required font!');
});
```

**注意事项和陷阱**

虽然 PixiJS 确实使处理文本变得容易，但您需要注意一些事项。

首先，更改现有文本字符串需要重新生成该文本的内部渲染，这是一个缓慢的操作，如果您每帧更改许多文本对象，可能会影响性能。如果您的项目需要同时在屏幕上显示大量经常更改的文本，请考虑使用 PIXI.BitmapText 对象（如下所述），该对象使用固定的位图字体，当文本更改时不需要重新生成。

其次，缩放文本时要小心。将文本对象的比例设置为 > 1.0 将导致模糊/像素显示，因为文本不会以看起来清晰所需的更高分辨率重新呈现 - 它仍然与生成时的分辨率相同。为了解决这个问题，您可以改为以更高的初始尺寸和缩小比例进行渲染。这将使用更多内存，但会让您的文本始终看起来清晰明快。

**二、位图文字**
用的真少，除了向项目添加文本的标准 PIXI.Text 方法外，PixiJS 还支持_位图字体_。位图字体与 TrueType 或其他通用字体有很大不同，因为它们由单个图像组成，其中包含您要使用的每个字母的预渲染版本。当使用位图字体绘制文本时，PixiJS 不需要将字体字形渲染到临时缓冲区中——它可以简单地从主字体图像中复制并标记出字符串的每个字符。

这种方法的主要优点是速度 - 频繁更改文本的成本要低得多，并且由于共享源纹理，渲染每个额外的文本片段要快得多。

```js
    const app = new PIXI.Application({ background: "#1099bb" });

    document.body.appendChild(app.view);

  

    // 加载器

    PIXI.Assets.load(

      "https://pixijs.io/examples/examples/assets/bitmap-font/desyrel.xml"

    ).then(() => {

      const bitmapFontText = new PIXI.BitmapText(

        "bitmap fonts are supported!\nWoo yay!",

        {

          fontName: "Desyrel",

          fontSize: 55,

          align: "left",

        }

      );

  

      bitmapFontText.x = 50;

      bitmapFontText.y = 200;

  

      app.stage.addChild(bitmapFontText);

    });
```


###### assets资产
使用时PIXI.Assets.load要记住的一件非常重要的事情`Assets`是所有请求都被缓存，如果 URL 相同，则返回的承诺也将相同。
```js
   const app = new PIXI.Application({ background: "#1099bb" });

    document.body.appendChild(app.view);

  

    // 使用时要记住的一件非常重要的事情Assets是所有请求都被缓存，如果 URL 相同，则返回的承诺也将相同。

    const texturePromise = PIXI.Assets.load("https://pixijs.io/examples/examples/assets/bunny.png");

  

    // When the promise resolves, we have the texture!

    texturePromise.then((resolvedTexture) => {

      // create a new Sprite from the resolved loaded Texture

      const bunny = PIXI.Sprite.from(resolvedTexture);

  

      // center the sprite's anchor point

      bunny.anchor.set(0.5);

  

      // move the sprite to the center of the screen

      bunny.x = app.screen.width / 2;

      bunny.y = app.screen.height / 2;

  

      app.stage.addChild(bunny);

    });
```
**异步转同步**
略，这还用讲？

**捆绑包**
```js
PIXI.Assets.addBundle('animals', { bunny: 'bunny.png', chicken: 'chicken.png', thumper: 'thumper.png', }); const assets = await PIXI.Assets.loadBundle('animals');
```
```js
// API
{ "bundles":[ { "name":"load-screen", "assets":[ { "name":"background", "srcs":"sunset.png" }, { "name":"bar", "srcs":"load-bar.{png,webp}" } ] }, { "name":"game-screen", "assets":[ { "name":"character", "srcs":"robot.png" }, { "name":"enemy", "srcs":"bad-guy.png" } ] } ] }
// 记住你只能init一次
PIXI.Assets.init({manifest: "path/manifest.json"});
```

###### 性能优化思路
```md
## 性能提示

### 一般的

-   只在需要时优化！PixiJS 可以立即处理大量内容
-   请注意场景的复杂性。添加的对象越多，速度就越慢
-   顺序可以提供帮助，例如 sprite / graphic / sprite / graphic 比 sprite / sprite / graphic / graphic 慢
-   一些较旧的移动设备运行速度稍慢。将选项传递`useContextAlpha: false`给`antialias: false`渲染器或应用程序可以帮助提高性能
-   默认情况下禁用剔除，因为通常最好在应用程序级别执行此操作或将对象设置为`cullable = true`. 如果您受 GPU 限制，它将提高性能；如果你受 CPU 限制，它会降低性能

### 精灵

-   尽可能使用 Spritesheet 来最小化总纹理
-   最多可以使用 16 种不同的纹理对精灵进行批处理（取决于硬件）
-   这是呈现内容的最快方式
-   在旧设备上使用较小的低分辨率纹理
-   将扩展添加`@0.5x.png`到缩小 50% 的 spritesheet，这样 PixiJS 就会在视觉上自动将它们加倍
-   绘制顺序可能很重要

### 图形

-   图形在不经常修改时最快（不包括变换、alpha 或色调！）
-   图形对象在一定大小（100 点或更小）以下时被批处理
-   小型 Graphics 对象与 Sprites（矩形、三角形）一样快
-   使用 100 多个图形复杂对象可能会很慢，在这种情况下使用精灵（您可以创建纹理）

### 质地

-   纹理由纹理垃圾收集器自动管理
-   您也可以使用`texture.destroy()`
-   如果您计划一次摧毁多个
-   如果您打算自己删除大量纹理，请延迟纹理销毁

### 文本

-   避免在每一帧都更改它，因为这可能很昂贵（每次绘制到画布然后上传到 GPU）
-   位图文本为动态更改文本提供了更好的性能
-   文本分辨率匹配渲染器分辨率，通过设置`resolution`属性自行降低分辨率，这样可以减少内存消耗

### 面具

-   如果使用太多面具可能会很昂贵：例如，100 个面具真的会减慢速度
-   轴对齐矩形掩码是最快的（因为使用剪刀矩形）
-   图形遮罩是第二快的（因为它们使用模板缓冲区）
-   精灵面具是第三快的（他们使用过滤器）。它们真的很贵。不要在你的场景中使用太多！

### 过滤器

-   释放内存：`displayObject.filters = null`
-   如果您知道它们的大小：`displayObject.filterArea = new PIXI.Rectangle(x,y,w,h)`. 这可以加快速度，因为这意味着不需要测量物体
-   过滤器很贵，使用太多会开始减慢速度！

### 混合模式

-   不同的混合模式将导致批次中断（去优化）
-   SceenSprite / NormalSprite / SceenSprite / NormalSprite 将是 4 个绘制调用
-   SceenSprite / SceenSprite / NormalSprite / NormalSprite 将是 2 个绘制调用

### 缓存为位图

-   设置为`true`通过将对象缓存为纹理将其转换为 Sprite
-   它在将对象绘制到纹理时被激活时具有一次性成本
-   避免频繁更改元素
-   如果您有一个复杂的项目，它有很多精灵/过滤器并且不会移动，那么这将加快渲染速度！
-   不需要应用于精灵，因为它们已经是纹理
-   如果子项不断变化的对象不要使用，因为这会减慢速度

### 事件

-   如果对象没有交互式子对象，请使用`interactiveChildren = false`. 然后事件系统将能够避免爬过对象
-   `hitArea = new PIXI.Rectangle(x,y,w,h)`如上设置应该会阻止事件系统从对象中爬取
```

### 3D库
我们以Three.js库为主。
安装方式：
1.npm包
```html
npm i three
<script async type="module">
    import * as THREE from "/webGpu/3D/node_modules/three/src/Three.js";
</script>
```
2.CDN：
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js"></script>
<script type="module">import three from '[https://cdn.jsdelivr.net/npm/three@0.150.1/+esm](https://cdn.jsdelivr.net/npm/three@0.150.1/+esm)'</script>
```
3.CDN映射，这个真的少用
```html
<script type="importmap"> { "imports": { "three": "https://unpkg.com/three@<version>/build/three.module.js" } } </script>
```
兼容性检查，需要引入webgl
```js
if (WebGL.isWebGLAvailable()) { 
// Initiate function or other initializations here 
	animate();
} 
else { 
		const warning = WebGL.getWebGLErrorMessage();
		document.getElementById('container').appendChild(warning); 
	 }
```

#### 渲染器
有多种，官方推荐WebGLRenderer
```js
// 渲染器
    const renderer = new THREE.WebGLRenderer();
    // 渲染器宽高设置
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 加入canvas
    document.body.appendChild(renderer.domElement);
```

#### 摄像机
camera存在多种摄像机，推荐PerspectiveCamera
```js
const camera = new THREE.PerspectiveCamera(

      // 视野角度（FOV）

      75,

      // 长宽比（aspect ratio）

      window.innerWidth / window.innerHeight,

      // 近截面（near）

      0.1,

      // 远截面（far）

      1000

    );
```

#### 场景
```js
const scene = new THREE.Scene();
```
#### 画线几何
用到了渲染缓冲器。
```html
<script async type="module" crossorigin="anonymous">

    import * as THREE from "/webGpu/3D/node_modules/three/src/Three.js";

  

    // 渲染器

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

  

    // 摄像机

    const camera = new THREE.PerspectiveCamera(

      45,

      window.innerWidth / window.innerHeight,

      1,

      500

    );

    camera.position.set(0, 0, 100);

    camera.lookAt(0, 0, 0);

  

    // 创建场景

    const scene = new THREE.Scene();

    // 定义一个材质

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // 创建几何体

    const points = [];

    points.push(new THREE.Vector3(-10, 0, 0));

    points.push(new THREE.Vector3(0, 10, 0));

    points.push(new THREE.Vector3(10, 0, 0));

  

    // 使用缓冲器，将三个点存储起来

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // 使用连线

    const line = new THREE.Line( geometry, material );

    // 加入场景

    scene.add( line );

    // 渲染

    renderer.render( scene, camera );

  </script>

```
#### 创建文字
官方推荐直接写。。。
![](Pasted%20image%2020230301224146.png)


#### 载入3D模型
目前，3D模型的格式有成千上万种可供选择，但每一种格式都具有不同的目的、用途以及复杂性。 虽然 [three.js已经提供了多种导入工具](https://github.com/mrdoob/three.js/tree/dev/examples/jsm/loaders)， 但是选择正确的文件格式以及工作流程将可以节省很多时间，以及避免遭受很多挫折。某些格式难以使用，或者实时体验效率低下，或者目前尚未得到完全支持。
#####  推荐模型格式
如果有可能的话，我们推荐使用glTF（gl传输格式）。.GLB和.GLTF是这种格式的这两种不同版本， 都可以被很好地支持。由于glTF这种格式是专注于在程序运行时呈现三维物体的，所以它的传输效率非常高，且加载速度非常快。 功能方面则包括了网格、材质、纹理、皮肤、骨骼、变形目标、动画、灯光和摄像机。

##### 免费模型网站
公共领域的glTF文件可以在网上找到，例如 [Sketchfab](https://sketchfab.com/models?features=downloadable&sort_by=-likeCount&type=models)，或者很多工具包含了glTF的导出功能：
-   [Blender](https://www.blender.org/) by the Blender Foundation
-   [Substance Painter](https://www.allegorithmic.com/products/substance-painter) by Allegorithmic
-   [Modo](https://www.foundry.com/products/modo) by Foundry
-   [Toolbag](https://www.marmoset.co/toolbag/) by Marmoset
-   [Houdini](https://www.sidefx.com/products/houdini/) by SideFX
-   [Cinema 4D](https://labs.maxon.net/?p=3360) by MAXON
-   [COLLADA2GLTF](https://github.com/KhronosGroup/COLLADA2GLTF) by the Khronos Group
-   [FBX2GLTF](https://github.com/facebookincubator/FBX2glTF) by Facebook
-   [OBJ2GLTF](https://github.com/AnalyticalGraphicsInc/obj2gltf) by Analytical Graphics Inc
-   …and [还有更多](http://github.khronos.org/glTF-Project-Explorer/)

倘若你所喜欢的工具不支持glTF格式，请考虑向该工具的作者请求glTF导出功能， 或者在[the glTF roadmap thread](https://github.com/KhronosGroup/glTF/issues/1051)贴出你的想法。
当glTF不可用的时候，诸如FBX、OBJ或者COLLADA等等其它广受欢迎的格式在Three.js中也是可以使用、并且定期维护的。

待续...






#### 进阶

##### 更新场景

##### 处理废弃


##### VR内容


##### 后期处理

##### 矩阵变换


##### 动画系统


#### 进阶操作




## ★进阶
本篇章，主要是进阶的玩法。尤其是在AI和大数据的背景下，对于数据可视化的要求越来越高。
尤其是图形界面的高交互性，报表和图形融合，对于前端要求也越来越高。

### GIS地理信息开发
这是常规的用法，地理信息是大数据的重要组成部分。如果想要呈现炫酷的效果，一副地图不可避免。

另开仓库展示。地址：[GIS](https://github.com/LeroyK111/gisDisplayBoard)

### 数字孪生
对生产制造业的加工制造管理流程，进行可视化监管。也是我最喜欢的领域，工业互联网的基础，就是定制化开发工厂的中控平台。

另开仓库展示。地址：[Industrial digital show panel](https://github.com/LeroyK111/IndustrialDigitalPanel)

### 游戏开发
JavaScript当然可以做游戏开发。作为很多2D游戏引擎基本编辑语言，3D游戏引擎由于光追盛行，为了追求更好性能，一般都是C/C++，C#，Rust等语言。
|游戏引擎|脚本语言|可视化蓝图|
|----|----|----|
|unreal engine|C++|Blueprint|
|cryengine|C++, C#|Flow Graph|
|unity|C#||

建模：三维建模，渲染师等。
贴图：原画师，平面设计师等等。
混音：音效师等。
引擎：给资源赋予脚本，光追渲染等，打包成为一个游戏。

另开仓库展示。地址：[雷霆战机](https://github.com/LeroyK111/ThunderCross)
3D游戏性能并不好，请注意。