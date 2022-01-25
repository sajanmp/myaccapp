import React from 'react';
import {Link} from 'react-router-dom'

function Main() {
  return <div>
      <div className="container">
        <div className="text-center btn-primary mb-3 mt-5">
          <Link className="text-white" to="/accheads" style={{ "text-decoration": "none" }}>Account Heads</Link>
        </div>
        <div className="text-center btn-primary mb-3">
          <Link className="text-white" to="/vouchers" style={{ "text-decoration": "none" }}>Voucher</Link>
        </div>
        <div className="text-center btn-primary mb-3">
          <Link className="text-white" to="/ledger" style={{ "text-decoration": "none" }}>Ledger</Link>
        </div>
      </div>
  </div>;
}

export default Main;
