import React, {useEffect} from 'react'
import { Outlet, Link } from "react-router-dom";

function AccHeads() {
  
  useEffect(() => {
    return () => { console.log("Unmounting Account Heads") }
  }, [])

  return (
    <>
      <div className="container">
        <div className="text-center btn-primary mb-3 mt-5">
          <Link className="text-white" to="/addacchead" style={{ "text-decoration": "none" }}>Add Account Head</Link>
        </div>
        <div className="text-center btn-primary mb-3">
          <Link className="text-white" to="/modifyacchead" style={{ "text-decoration": "none" }}>Modify Account Head</Link>
        </div>
        <div className="text-center btn-primary mb-3">
          <Link className="text-white" to="/" style={{ "text-decoration": "none" }}>Back</Link>
        </div>
      </div>
      <Outlet />
    </>
  )


}

export default AccHeads
