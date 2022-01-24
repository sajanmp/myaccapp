import logo from './logo.svg';
import './App.css';
import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import AccHeads from './components/AccHeads';
import AddVoucher from './components/AddVoucher';
import Ledger from './components/Ledger';

function App() {
  const [state, setState] = useState("");

  useEffect(() => {
    setState("default")
  }, [])


  var html;


  if (state === "default") {
    html =
      <div className='container text-center mt-5'>
        <div className="row mb-3">
          <button className='btn btn-primary btn-lg btn-block' onClick={() => { setState("accheads") }}>ACCOUNT HEADS</button>
        </div>
        <div className="row mb-3">
          <button className='btn btn-primary btn-lg btn-block' onClick={() => { setState("vouchers") }}>VOUCHERS</button>
        </div>
        <div className="row mb-3">
          <button className='btn btn-primary btn-lg btn-block' onClick={() => { setState("ledger") }}>LEDGER</button>
        </div>
        <div className="row mb-3">
          <button className='btn btn-primary btn-lg btn-block' onClick={() => { setState("balance") }}>BALANCE</button>
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
      <div className="container">
        <div className ="text-center btn-primary mb-3 mt-5">
          <Link className="text-white" to="/accheads" style={{"text-decoration":"none"}}>Account Heads</Link>
        </div>
        <div className="text-center btn-primary mb-3">
          <Link className="text-white" to="/vouchers" style={{"text-decoration":"none"}}>Voucher</Link>
        </div>
        <div className="text-center btn-primary mb-3">
          <Link className="text-white" to="/ledger" style={{"text-decoration":"none"}}>Ledger</Link>
        </div>
      </div>
      <Outlet />
    </>
  )


}

export default App;
