import React, { useState, useEffect } from 'react'
import AddAccHead from './AddAccHead'
import ModifyAccHead from './ModifyAccHead'
import App from '../App';

function AccHeads() {
    const [state, setState] = useState("");

    var html;

    if (state === "menu") {
        html = <div className='container text-center pt-5'>
            <div className="row mb-3">
                <button className="btn btn-primary btn-lg btn-block" onClick={()=>{setState("add")}}>ADD ACCOUNT</button>
            </div>
            <div className="row mb-3">
                <button className = "btn btn-primary btn-lg btn-block" onClick={()=>{setState("edit")}}>MODIFY ACCOUNT</button>
            </div>
            <div className="row mb-3">
                <button className = "btn btn-primary  btn-lg btn-block" onClick={()=>{setState("back")}}>BACK</button>
            </div>
        </div>
    }

    if (state === "add") {
        html = <AddAccHead />
    }

    if (state === "edit") {
        html = <ModifyAccHead />
    }

    if (state === "back") {
        html = <App />
    }


    useEffect(() => {
      setState("menu");
    }, [])


    return (
        <>
         {html}
        </>
    )
}

export default AccHeads
