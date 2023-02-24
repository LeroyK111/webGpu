import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.less";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>测试数据: {count}</h1>
      <img
        src={reactLogo}
        alt=""
        onClick={() => {
          setCount(count + 1);
        }}
      />
    </div>
  );
}

export default App;
