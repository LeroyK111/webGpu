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


### 2D图形




### 3D图形








## 常用库



## 进阶
