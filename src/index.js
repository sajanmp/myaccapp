import React from 'react';
import ReactDOM from 'react-dom';
import AccHeads from './components/AccHeads';
import AddVoucher from './components/AddVoucher';
import Ledger from './components/Ledger';
import ModifyVoucher  from './components/ModifyVoucher';
import AddAccHead from './components/AddAccHead';
import ModifyAccHead from './components/ModifyAccHead';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App />}/>
          <Route path="/myaccapp" element={<App />}/>
          <Route path="accheads" element={<AccHeads />} />
          <Route path="addacchead" element={<AddAccHead />} />
          <Route path="modifyacchead" element={<ModifyAccHead />} />
          <Route path="vouchers" element={<AddVoucher />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="modifyvoucher/:id" element = {<ModifyVoucher />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

