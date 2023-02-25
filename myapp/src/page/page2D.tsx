import { useState, useEffect, useRef, useMemo, useReducer } from "react";
import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, useTick } from "@pixi/react";

const reducer = (_: any, { data }: any) => data;


// 一个组件
const Bunny = () => {
  const [motion, update] = useReducer(reducer, undefined);
  const iter = useRef(0);

  // 绑定ticker，周期性执行
  useTick((delta) => {
    const i = (iter.current += 0.05 * delta);
    
    // 触发更新
    update({
      type: "update", // 这句主要是为了区别，做更高级状态处理，删除也不碍事
      data: {
        x: Math.sin(i) * 100,
        y: Math.sin(i / 1.5) * 100,
        rotation: Math.sin(i) * Math.PI,
        anchor: Math.sin(i / 2),
      },
    });
  });

  return (
    // 将精灵封装
    <Sprite image="https://pixijs.io/pixi-react/img/bunny.png" {...motion} />
  );
};

const page2D = () => {
  // !这里我们就不讲究这么多了，直接写2d渲染
  return (
    // 舞台
    <Stage width={300} height={300} options={{ backgroundAlpha: 0x01262a }}>
      {/* 容器 */}
      <Container x={150} y={150}>
        <Bunny />
      </Container>
    </Stage>
  );
};

export default page2D;
