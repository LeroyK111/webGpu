import { useState, useEffect, useRef, useMemo } from "react";
import { BlurFilter } from 'pixi.js';
import { Stage, Container, Sprite, Text } from "@pixi/react";


const page2D = () => {
  // !这里我们就不讲究这么多了，直接写2d渲染
  const blurFilter = useMemo(() => new BlurFilter(4), []);

  return (
    // 舞台
    <Stage>
      {/* 精灵 */}
      <Sprite
        image="https://pixijs.io/pixi-react/img/bunny.png"
        x={400}
        y={270}
        anchor={{ x: 0.5, y: 0.5 }}
      />


      {/* 容器 */}
      <Container x={400} y={330}>
        {/* 文本 */}
        <Text
          text="Hello World"
          anchor={{ x: 0.5, y: 0.5 }}
          filters={[blurFilter]}
        />
      </Container>
    </Stage>
  );
};

export default page2D;
