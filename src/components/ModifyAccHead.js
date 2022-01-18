import React, { useState, useEffect } from 'react'
import AccHeads from './AccHeads'
import { collection, updateDoc, doc, query, where, getDoc, getDocs, deleteDoc, orderBy } from 'firebase/firestore/lite';
import { db } from '../config/firebase';

function ModifyAccHead() {
    const types = ["Cash", "Bank", "Income", "Expense", "Savings", "Debtors", "Creditors", "Assets", "Liabilities"]

    const accHeadsCollectionRef = collection(db, "accheads");

    const initialValue = {
        name: '',
        type: '',
        op_debit: 0,
        op_credit: 0,
        amt: 0,
        active: true
    }

    const [accHeads, setAccHeads] = useState([]);
    const [accHead, setAccHead] = useState({ initialValue });
    const [state, setState] = useState("default");
    const [id, setId] = useState("");



    const handleChange = (e) => {
        var obj = { ...accHead };

        if (e.target.name === "name") {
            obj.name = e.target.value;
        }

        if (e.target.name === "type") {
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

        if (e.target.name === "active") {
            obj.active = e.target.checked;
        }

        setAccHead(obj);
    }

    const getData = async (e) => {
        const q = query(accHeadsCollectionRef, where("name", "==", e.target.value))
        const querySnapShot = await getDocs(q);
        if (querySnapShot.empty) {
            alert("Account Head not found");
            return;
        }
        querySnapShot.forEach((doc) => {
            setAccHead(doc.data())
            setId(doc.id);
        })
    }

    const updateAccHead = async (e) => {
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

        const q = query(accHeadsCollectionRef, where("name", "==", accHead.name))
        const querySnapShot = await getDocs(q);
        let found = false;

        querySnapShot.forEach((doc) => {
            if (doc.id !== id) {
                found = true;
                return;
            }
        })

        if (found) {
            alert("Duplicate Entry");
            return;
        }


        try {
            const accHeadDoc = doc(db, "accheads", id);
            
            await updateDoc(accHeadDoc,
                      { name: accHead.name, 
                        type: accHead.type, 
                        op_debit: Number(accHead.op_debit), 
                        op_credit: Number(accHead.op_credit), 
                        amt: Number(accHead.amt),
                        active: accHead.active
                     });

            setState("back")
        }
        catch (err) {
            alert(err);
        }
    }

    const deleteAccHead = async (e) => {
        e.preventDefault();

        if (window.confirm("Are you sure?") === false)
            return;

        console.log(id);

        try {
            const accHeadDoc = doc(db, "accheads", id);
            const docSnap = await getDoc(accHeadDoc);

            if (!docSnap.exists()) {
                alert("Document not found");
                return;
            }

            console.log(accHeadDoc);
            /*
            if (!accHeadDoc.exists) {
                alert("Document not found");
                return;
            }
            */
            await deleteDoc(accHeadDoc);
            setState("back");
        }
        catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        const getAccHeads = async () => {
            //const data = await getDocs(accHeadsCollectionRef);

            const q = query(accHeadsCollectionRef, orderBy("name"))

            const data = await getDocs(q);

            setAccHeads(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        };

        getAccHeads();

        setState("default");
    }, [])

    var html;

    if (state === "default") {
        html =
            <div class="container">
                <h1 className="text-center">Modify Account Head</h1>
                <form method='post' action="#">
                    <div className="row mb-3">
                        <label for="selhead" className="form-label col-sm-2">Select Account Head</label>
                        <div className="col-sm-10">
                            <select name="selhead" className="form-control" onChange={(e) => getData(e)}>
                                {accHeads && accHeads.map((obj, index) => {
                                    return (
                                        <option key={obj.id}>{obj.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="name" className="form-label col-sm-2">New Name</label>
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

                    <div className="row mb-3">
                        <label for="active" className="form-label col-sm-2">Active</label>
                        <div className="col-sm-1">
                            <input type="checkbox"  
                                id="active" name = "active" checked = {accHead.active} value="Active"
                                onChange={(e) => handleChange(e)}></input>
                        </div>
                    </div>

                    <div class="text-center">
                        <button className="btn btn-primary me-2" onClick={(e) => { updateAccHead(e) }}>Save</button>
                        <button className="btn btn-primary me-2" onClick={(e) => { deleteAccHead(e) }}>Delete</button>
                        <button className="btn btn-secondary" onClick={(e) => { setState("back") }}>Back</button>
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

export default ModifyAccHead
