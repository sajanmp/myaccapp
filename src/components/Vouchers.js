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
            <div>
                <p>
                    <button onClick={() => { setState("cr") }}>CASH RECEIPTS</button>
                </p>
                <p>
                    <button onClick={() => { setState("cp") }}>CASH PAYMENTS</button>
                </p>
                <p>
                    <button onClick={() => { setState("br") }}>BANK RECEIPTS</button>
                </p>
                <p>
                    <button onClick={() => { setState("bp") }}>BANK PAYMENTS</button>
                </p>
                <p>
                    <button onClick={() => { setState("jv") }}>JOURNAL</button>
                </p>
                <p>
                    <button onClick={() => { setState("cv") }}>CONTRA</button>
                </p>                
                <p>
                    <button onClick={() => { setState("back") }}>BACK</button>
                </p>
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
