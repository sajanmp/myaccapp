import React, { useState, useEffect } from 'react'
import AddAccHead from './AddAccHead'
import ModifyAccHead from './ModifyAccHead'
import App from '../App';
import { Outlet, Link } from "react-router-dom";

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

/*
    return (
        <>
         {html}
        </>
    )
    */

    return (
        <>
          <div className="container">
            <div className ="text-center btn-primary mb-3 mt-5">
              <Link className="text-white" to="/addacchead" style={{"text-decoration":"none"}}>Add Account Head</Link>
            </div>
            <div className="text-center btn-primary mb-3">
              <Link className="text-white" to="/modifyacchead" style={{"text-decoration":"none"}}>Modify Account Head</Link>
            </div>
          </div>
          <Outlet />
        </>
      )


}

export default AccHeads
