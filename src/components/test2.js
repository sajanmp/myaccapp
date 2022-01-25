import React, { useEffect } from 'react';

function Test2() {
    useEffect(()=>{
        console.log("Mounting test2..")
        return () => {console.log("Unmounting test2...")}
    },[])
    return (
        <div>
            <h1>This is component Test 2</h1>
        </div>
    );
}

export default Test2;


