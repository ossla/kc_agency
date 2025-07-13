import React, { useState } from 'react';
import { Actor } from './component/Actor';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Actor />
    </div>
  );
}

export default App;
