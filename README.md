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
```

```



### 3D库






## ★进阶
本篇章，主要是进阶的玩法。尤其是在AI和大数据的背景下，对于数据可视化的要求越来越高。
尤其是图形界面的高交互性，报表和图形高度耦合，对于前端要求也越来越高。

### GIS地理信息开发
这是常规的用法，地理信息是大数据的重要组成部分。如果想要呈现炫酷的效果，一副地图不可避免。


### 数字孪生
对生产制造业的加工制造管理流程，进行可视化监管。也是我最喜欢的领域，工业互联网的基础，就是定制化开发工厂的中控平台。



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



