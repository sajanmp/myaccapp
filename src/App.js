import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useContext } from 'react'
import AccHeads from './components/AccHeads';
import AddAccHead from './components/AddAccHead';
import ModifyAccHead from './components/ModifyAccHead';
import AddVoucher from './components/AddVoucher';
import Ledger from './components/Ledger';
import ModifyVoucher from './components/ModifyVoucher';
import LedgerReport from './components/LedgerReport';
import Test from './components/test';
import Main from './components/Main'
import { UserContext } from './components/CreateContext';
import { AuthContext } from './components/CreateContext';
import {
  Route,
  Routes,
} from "react-router-dom";


function App(props) {
  //const [value, setValue] = useState("hello from context");
  const [value, setValue] = useState({});
  const [auth, setAuth] = useState(false);
  const [msg, setMsg] = useState("");
  const [text, setText] = useState("")

  const checkAuth = () => {
    if (text === "2501") {
        setAuth(true);
    }
    else {
        setMsg("Invalid MPin");
    }
}

  useEffect(() => {
    setAuth(false);
    console.log(props.token);
    if (props.token === "123@679ASDF") {
      setAuth(true)
      console.log(auth);
    }
  }, [])

  var html = ""

  if (!auth) {
    html =
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-12 text-center">
                    <label>MPin</label>
                </div>
                <div className="col-md-12 text-center">
                    <input type="password"
                        value={text}
                        onChange={e => {
                              setText(e.target.value)
                              setMsg("")}}>
                    </input>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12 text-center">
                    <button onClick={() => checkAuth()}>Ok</button>
                </div>
            </div>
            <div className="row mt-3">
                <div className ="col-md-12 text-center text-danger">
                    {msg}
                </div>
            </div>
        </div>
}




  return (
    <div className="container">
        <UserContext.Provider value={{ value, setValue }}>
          {auth === false ? html : null}
          <Routes>
            {auth  
               ? <Route path="/" element={<Main />} />
               : null
            }
            
            {auth
               ? <Route path="myaccapp" element={<Main />} />
               : null
            }
         
            <Route path="/test" element={<Test />} />
            {auth ? <Route path="accheads" element={<AccHeads />} /> : null}
            {auth ? <Route path="addacchead" element={<AddAccHead />} /> : null}
            {auth ? <Route path="modifyacchead" element={<ModifyAccHead />} /> : null}
            {auth ? <Route path="vouchers" element={<AddVoucher />} /> : null}
            {auth ? <Route path="ledger" element={<Ledger />} /> : null}
            {auth ? <Route path="modifyvoucher/:id" element={<ModifyVoucher />} /> : null}
            {auth ? <Route path="ledgerreport" element={<LedgerReport />} /> : null}
          </Routes>
        </UserContext.Provider>
    </div>
  );
}

export default App;
