import React, {useState, useEffect} from 'react'
import Vouchers from './Vouchers';

function AddVoucher(props) {
    const [state,setState] = useState("");

    var header="";

    console.log(props);

    if (props.type.state ==="cr")
       header = "CASH RECEIPT";
    
    if (props.type.state === "br")
       header = "BANK RECEIPT";

    if (props.type.state === "cp")
       header = "CASH PAYMENT";

    if (props.type.state === "bp")
       header = "BANK PAYMENT";   

    if (props.type.state === "jv")
       header = "JOURNALS";       

     if (props.type.state === "cv")
       header = "CONTRA";

       useEffect(() => {
           setState("default");

       }, [])

       var html;

       if (state === "default") {
           html = 
          <div>
            <h1>{header}</h1>
            <button onClick={(e)=>{setState("back")}}>Back</button>
        </div>
       }

       if (state === "back") {
           html = <Vouchers />;
       }

    return (
        <div>
            {html}
        </div>
    )
}

export default AddVoucher
