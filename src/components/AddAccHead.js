import React, { useState, useEffect } from 'react'
import AccHeads from './AccHeads'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore/lite';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom'

function AddAccHead() {
    const types = ["", "Cash", "Bank", "Income", "Expense", "Savings", "Debtors", "Creditors", "Assets", "Liabilities"]

    const accHeadsCollectionRef = collection(db, "accheads");

    const initialValue = {
        name: '',
        type: '',
        op_debit: 0,
        op_credit: 0,
        amt: 0,
        active: true
    }

    const [accHead, setAccHead] = useState(initialValue);
    const [state, setState] = useState("default");



    const handleChange = (e) => {
        var obj = { ...accHead };

        if (e.target.name === "name") {
            obj.name = e.target.value;
        }

        if (e.target.name === "type") {
            console.log(e.target.value);
            obj.type = e.target.value;
        }

        if (e.target.name === "op_debit") {
            obj.op_debit = e.target.value;
            if (obj.op_debit > 0)
                obj.op_credit = 0;
        }

        if (e.target.name === "op_credit") {
            obj.op_credit = e.target.value;
            if (obj.op_credit > 0) {
                obj.op_debit = 0;
            }
        }

        if (e.target.name === "amt") {
            obj.amt = e.target.value;
        }

        setAccHead(obj);
    }

    const createAccHead = async (e) => {
        e.preventDefault();
        console.log(accHead.name);
        if (accHead.name === undefined || accHead.name === '') {
            alert("Account Head not specified");
            return;
        }

        if (accHead.type === undefined || accHead.type === '') {
            alert("Account Type not specified")
            return;
        }

        if (accHead.name === "") {
            alert("Account Head not specified");
            return;
        }

        const q = query(accHeadsCollectionRef, where("name", "==", accHead.name))
        const querySnapShot = await getDocs(q);
        if (!querySnapShot.empty) {
            alert("Duplicate Entry");
            return;
        }

        /*
                await addDoc(accHeadsCollectionRef, 
                    { name: accHead.name, 
                      type: accHead.type, 
                      op_debit: Number(accHead.op_debit), 
                      op_credit: Number(accHead.op_credit), 
                      amt : Number(accHead.amt),
                      active: true });
        */

        await addDoc(accHeadsCollectionRef, accHead);
        setAccHead(initialValue);
    }

    useEffect(() => {
        setState("default");
    }, [])

    var html;

    if (state === "default") {
        html =
            <div class="container">
                <div className="text-left mb-3 mt-3">
                    <Link to="/accheads" >Back</Link>
                </div>
                <h1 className="text-center">Add Account Head</h1>
                <form method='post' action="#">
                    <div className="row mb-3">
                        <label for="name" className="form-label col-sm-2">Account Head</label>
                        <div className="col-sm-10">
                            <input type="text" name="name" className="form-control"
                                id="name" value={accHead.name} onChange={(e) => handleChange(e)}></input>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="type" className="form-label col-sm-2">Type</label>
                        <div className="col-sm-10">
                            <select name="type" value={accHead.type} className="form-control" onChange={(e) => handleChange(e)}>
                                {types && types.map((item, index) => {
                                    return (
                                        <option key={item}>{item}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="op_debit" className="form-label col-sm-2">Opening (Debit)</label>
                        <div className="col-sm-10">
                            <input type="text" name="op_debit" className="form-control"
                                id="op_debit" value={accHead.op_debit} onChange={(e) => handleChange(e)}></input>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="op_credit" className="form-label col-sm-2">Opening (Credit)</label>
                        <div className="col-sm-10">
                            <input type="text" name="op_credit" className="form-control"
                                id="op_credit" value={accHead.op_credit} onChange={(e) => handleChange(e)}></input>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="amt" className="form-label col-sm-2">Fixed Amount</label>
                        <div className="col-sm-10">
                            <input type="text" name="amt" className="form-control"
                                id="amt" value={accHead.amt} onChange={(e) => handleChange(e)}></input>
                        </div>
                    </div>

                    <div class="text-center">
                        <button className="btn btn-primary me-2" onClick={(e) => { createAccHead(e) }}>Save</button>
                    </div>
                </form>
            </div>
    }

    if (state === "back") {

        html = <AccHeads />
    }

    return (
        <div>
            {html}
        </div>
    )
}

export default AddAccHead
