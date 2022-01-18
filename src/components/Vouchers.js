import React, { useState, useEffect } from 'react'
import App from '../App';
import AddVoucher from './AddVoucher';

function Vouchers() {
    const [state, setState] = useState("");

    useEffect(() => {
        setState("default");
    }, [])

    var html;

    if (state === "default") {
        html =
            <div className='container text-center pt-5'>
                <div className="row mb-3">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { setState("cr") }}>CASH RECEIPTS</button>
                </div>
                <div className="row mb-3">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { setState("cp") }}>CASH PAYMENTS</button>
                </div>
                <div className="row mb-3">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { setState("br") }}>BANK RECEIPTS</button>
                </div>
                <div className="row mb-3">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { setState("bp") }}>BANK PAYMENTS</button>
                </div>
                <div className="row mb-3">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { setState("jv") }}>JOURNAL</button>
                </div>
                <div className="row mb-3">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { setState("cv") }}>CONTRA</button>
                </div>                
                <div className="row mb-3">
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { setState("back") }}>BACK</button>
                </div>
            </div>
    }
    
    if (state ===  "back") {
        html = <App />
    }

    if (state !== "back" && state !== "default") {
        html = <AddVoucher type = {{state}} />
    }

    return (
        <div>
           {html}
        </div>
    )
}

export default Vouchers
