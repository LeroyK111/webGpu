import { useState } from "react";
import "./App.less";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./routers/navbar";

function App() {
  // 对于嵌套路由器，只能使用位置参数。
  let location = useLocation();
  // 匹配路由器只适合平行路由器。

  return (
    <div className="App">
      <div className="navbar">
        <NavBar></NavBar>
      </div>
      <div className="outlet">
        {location.pathname === "/" ? <h1>首页</h1> : <Outlet></Outlet>}
      </div>
    </div>
  );
}

export default App;
