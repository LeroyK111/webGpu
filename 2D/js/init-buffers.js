function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);

  return {
    position: positionBuffer,
  };
}

function initPositionBuffer(gl) {
  // 得到了缓冲对象并存储在顶点缓冲器
  const positionBuffer = gl.createBuffer();

  // 函数绑定上下文
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 数组记录正方体的每一个顶点
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  // 将其转换成webgl浮点数组，传入到gl缓冲器。
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

export { initBuffers };
