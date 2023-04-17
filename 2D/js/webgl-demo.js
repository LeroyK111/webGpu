// 导入缓冲器,存储顶点，会越来越复杂
import { initBuffers } from "./init-buffers.js";
// 开始绘制位置
import { drawScene } from "./draw-scene.js";

main();

// 主函数
function main() {
  const canvas = document.querySelector("#glcanvas");
  // 初始化 WebGL 上下文
  const gl = canvas.getContext("webgl");

  //确认 WebGL 支持性
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // 使用完全不透明的黑色清除所有图像
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 顶点着色器
  const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

  // 片段着色器
  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  // 初始化着色器程序，让 WebGL 知道如何绘制我们的数据
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // 配置区域, 可以使用
  const programInfo = {
    program: shaderProgram,
    // 获取顶点属性
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    // 从gl中,获取统一位置
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // 带入缓冲区
  const buffers = initBuffers(gl);

  // 绘制场景
  drawScene(gl, programInfo, buffers);
}

//初始化着色器程序，让 WebGL 知道如何绘制我们的数据
function initShaderProgram(gl, vsSource, fsSource) {
  // 这里是顶点着色器
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  // 片段着色器
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // 创建着色器程序
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // 如果创建失败，则弹窗
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

// 创建指定类型的着色器，上传 source 源码并编译
function loadShader(gl, type, source) {
  // 创建一个新的着色器
  const shader = gl.createShader(type);

  // 将源代码发送到着色器
  gl.shaderSource(shader, source);

  // 一旦着色器获取到源代码, 送入这里编译
  gl.compileShader(shader);

  // 检查是否成功编译了着色器
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  // 编译好，就返回编译的着色器
  return shader;
}
