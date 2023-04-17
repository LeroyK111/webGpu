function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // 清除黑色至透明

  gl.clearDepth(1.0); // 清空所有
  gl.enable(gl.DEPTH_TEST); // 启动深度测试
  gl.depthFunc(gl.LEQUAL); // 透视效果

  // 作画前，把画布清理干净
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 设置视野角度
  const fieldOfView = (45 * Math.PI) / 180; // 这里是弧度
  // 画布展示比例
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  // 0.1个单位之间的对象
  const zNear = 0.1;
  // 距离摄像机100个单位
  const zFar = 100.0;
  // 报错的话mat4 is not defined, 记得引入webgl矩阵计算glmatrix
  const projectionMatrix = mat4.create();

  // 计算，参数
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 再次创建一个矩阵，目的是为了把绘图位置设置为场景中心
  const modelViewMatrix = mat4.create();

  // 移动位置到中心位置
  mat4.translate(
    modelViewMatrix, // 目的矩阵
    modelViewMatrix, // 转换矩阵
    [-0.0, 0.0, -6.0]
  ); // 转义坐标

  // 告诉webGl如何拉出位置
  setPositionAttribute(gl, buffers, programInfo);

  // 告诉webgl 使用我们的位置
  gl.useProgram(programInfo.program);

  // 设置统一着色器
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    // 传入数组
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// 告诉webgl移动位置
// 缓冲器属性
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2; //每次迭代提取2个值
  const type = gl.FLOAT; // 缓冲区中的数据是32位浮点数
  const normalize = false; // 非浮点
  const stride = 0; // 从一组值到下一组值需要多少字节
  // 0 = 使用上面的type和numComponents
  const offset = 0; //从缓冲区中的多少字节开始
  // 绑定缓冲器
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  // 顶点Attrib指针
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  // 启用顶点数组
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

export { drawScene };
