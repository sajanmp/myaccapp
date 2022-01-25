import React, { useEffect, useContext } from 'react';
import { UserContext } from './CreateContext';

function Test1(props) {
    const {value,setValue} = useContext(UserContext);
    useEffect(()=>{
        console.log("Mouting...")
    },[])
    return (
        <div>
            <h1>{value}</h1>
            <h1>This is component Test 1</h1>
            <button onClick={()=>{setValue("New value")}}>Change value</button> 
        </div>
    );
}

export default Test1;


