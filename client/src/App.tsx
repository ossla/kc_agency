import React, { useState } from 'react';
import { Actor } from './component/Actor';
import { actor } from './data/actors';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Actor actor={ actor[0] } title = "actor"/>
    </div>
  );
}

export default App;
