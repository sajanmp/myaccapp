import React, { useState, useEffect } from 'react';
import Test1 from './test1';
import Test2 from './test2';

function Test() {
    const [count, setCount] = useState(0);
    const userName = {firstName: "Sajan", lastName:"MP"}
    useEffect((e) => {
        console.log("Mounted test...")
        return () => { console.log("Unmounted test...") }

    }, [])

    return (
        <div>
            <h1>Counter: {count}</h1>
            <button onClick={(e) => { setCount(count + 1) }}>Increment</button>
            <button onClick={(e) => { setCount(count -1) }}>Decrement</button>
            {count === 1 && <Test1 userName = {userName} />}
            {count === 2 && <Test2 />}
            {count === 3 && <Test1 />}
        </div>
            );
}

export default Test;
