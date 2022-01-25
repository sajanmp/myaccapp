import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import AccHeads from './components/AccHeads';
import AddAccHead from './components/AddAccHead';
import ModifyAccHead from './components/ModifyAccHead';
import AddVoucher from './components/AddVoucher';
import Ledger from './components/Ledger';
import ModifyVoucher from './components/ModifyVoucher';
import LedgerReport from './components/LedgerReport';
import Test from './components/test'
import Main from './components/Main'
import { UserContext } from './components/CreateContext';
import {
  Route,
  Routes,
} from "react-router-dom";


function App() {
  //const [value, setValue] = useState("hello from context");
  const [value, setValue] = useState({});
  


  useEffect(() => {
    let isMounted = true;
    console.log(isMounted);
    return () => {
      isMounted = false;
    }
  })

  return (
    <div className="container">
      <UserContext.Provider value={{value,setValue}}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/test" element={<Test />} />
          <Route path="accheads" element={<AccHeads />} />
          <Route path="addacchead" element={<AddAccHead />} />
           <Route path="modifyacchead" element={<ModifyAccHead />} />
          <Route path="vouchers" element={<AddVoucher />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="modifyvoucher/:id" element={<ModifyVoucher />} />
          <Route path="ledgerreport" element={<LedgerReport />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
