import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import AccHeads from './components/AccHeads';
import AddVoucher from './components/AddVoucher';
import Ledger from './components/Ledger';
import { db } from './config/firebase'

function AppOld() {
  const [state, setState] = useState("");

  useEffect(() => {
    setState("default")
  }, [])

  var html;

  if (state === "default") {
    html = 
    <div className='container text-center mt-5'>
      <div className ="row mb-3">
        <button className = 'btn btn-primary btn-lg btn-block' onClick={() => { setState("accheads") }}>ACCOUNT HEADS</button>
      </div>
      <div className ="row mb-3">
        <button className = 'btn btn-primary btn-lg btn-block' onClick={() => { setState("vouchers") }}>VOUCHERS</button>
      </div>
      <div className = "row mb-3">
        <button className = 'btn btn-primary btn-lg btn-block' onClick={() => { setState("ledger") }}>LEDGER</button>
      </div>
      <div className = "row mb-3">
        <button className = 'btn btn-primary btn-lg btn-block' onClick={() => { setState("balance") }}>BALANCE</button>
      </div>
    </div>
  }

  if (state === "accheads") {
    html = <AccHeads />
  }

  if (state === "vouchers") {
    html = <AddVoucher />
  }

  if (state === "ledger") {
    html = <Ledger />
  }

  if (state === "balance") {
    html = <h1>Balance</h1>
  }

  return (
    <>
    { html }
    </>
  );
}

export default AppOld;
