import React, { useState, useEffect } from 'react'
import { collection, doc, query, where, getDocs, orderBy, getDoc, deleteDoc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../config/firebase';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Ledger from './Ledger'
import { useParams } from 'react-router';
import {Link} from 'react-router-dom'

function ModifyVoucher(props) {
    const seriesList = ["CP", "BP", "BR", "CR", "CV", "JV"]

    const voucherCollectionRef = collection(db, "vouchers");
    const accHeadsCollectionRef = collection(db, "accheads");

    Moment.locale = "en";
    Moment.defaultFormat = "DD-MM-YYYY";

    const vouId = useParams();

    console.log(vouId.id);


    //console.log(Moment(currDate).format("DD-MM-YYYY"));

    //Moment(currDate).format("DD-MM-YYYY"),

    const initialValue = {
        series: "CP",
        date: new Date(),
        db_acc_name: "",
        cr_acc_name: "",
        db_acc_id: "",
        cr_acc_id: "",
        amt: 0,
        narr: ''
    }

    const [voucher, setVoucher] = useState(initialValue);
    const [dbAccHeads, setDbAccHeads] = useState([]);
    const [crAccHeads, setCrAccHeads] = useState([]);
    const [state, setState] = useState("default");
    const [series, setSeries] = useState("PV");
    const [header, setHeader] = useState("");
    const [flag, setFlag] = useState(false);

    const findArrayElementByName = (array, name) => {
        return array.find((element) => {
            return element.name === name;
        })
    }


    const assignHeader = (ser) => {

        if (ser === "CR")
            setHeader("Cash Receipt");

        if (ser === "BR")
            setHeader("Bank Receipt");

        if (ser === "CP")
            setHeader("Cash Payment");

        if (ser === "BP")
            setHeader("Bank Payment");

        if (ser === "JV")
            setHeader("Journal");

        if (ser === "CV")
            setHeader("Contra");

    }



    const handleChange = (e) => {
        var obj = { ...voucher };

        if (e.target.name === "series") {
            setSeries(e.target.value);
            obj.series = e.target.value;
            assignHeader(e.target.value);
            getDbAccHeads(e.target.value).then(arr => {
                setDbAccHeads(arr);
            });
            getCrAccHeads(e.target.value).then(arr => {
                setCrAccHeads(arr);
            });
        }

        if (e.target.name === "date") {
            obj.date = e.target.value;
        }

        if (e.target.name === "db_acc_name") {
            obj.db_acc_name = e.target.value;
            let data = findArrayElementByName(dbAccHeads, obj.db_acc_name);
            if (data != null) {
                obj.db_acc_id = data.id;
                if (data.amt > 0) {
                    if (obj.amt === 0)
                        obj.amt = data.amt
                }
            }
        }

        if (e.target.name === "cr_acc_name") {
            obj.cr_acc_name = e.target.value;
            let data = findArrayElementByName(crAccHeads, obj.cr_acc_name);
            if (data != null) {
                obj.cr_acc_id = data.id;
                if (data.amt > 0) {
                    if (obj.amt === 0)
                        obj.amt = data.amt
                }
            }
            else {
                alert("Account Head not found")
            };

        }

        if (e.target.name === "amt") {
            obj.amt = e.target.value;
        }

        if (e.target.name === "narr") {
            obj.narr = e.target.value;
        }


        setVoucher(obj);
    }

    const isDataClear = () => {
        if (voucher.date === undefined || voucher.date === "") {
            alert("Date not specified");
            return false;
        }

        if (voucher.db_acc_name === undefined || voucher.db_acc_name === "") {
            alert("Debit Account not specified");
            return false;
        }

        if (voucher.cr_acc_name === undefined || voucher.cr_acc_name === "") {
            alert("Credit Account not specified");
            return false;
        }

        if (voucher.db_acc_name === voucher.cr_acc_name) {
            alert("Credit and Debit Accounts cannot be the same");
            return false;
        }

        if (voucher.amt === undefined || voucher.amt <= 0) {
            alert("Amount not specified");
            return false;
        }

        return true;


    }

    const findArrayElementById = (array, id) => {
        return array.find((element) => {
            return element.id === id;
        })
    }


    const updateVoucher = async (e) => {
        e.preventDefault();

        if (!isDataClear())
            return;

        const docRef = doc(db, "vouchers", vouId.id);

        await updateDoc(docRef,
            {
                series: voucher.series,
                date: voucher.date,
                db_acc_id: voucher.db_acc_id,
                cr_acc_id: voucher.cr_acc_id,
                amt: Number(voucher.amt),
                narr: (voucher.narr === undefined ? "" : voucher.narr)
            });


        setFlag(true) //Updation successfull
    }

    const deleteVoucher = async (e) => {
        e.preventDefault();

        if (window.confirm("Are you sure?") === false)
            return;

        try {
            const docRef = doc(db, "vouchers", vouId.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                alert("Document not found");
                return;
            }

            await deleteDoc(docRef);
            setState("back");
        }
        catch (err) {
            alert(err);
        }
    }

    const handleDateChange = (date) => {
        var obj = { ...voucher };

        obj.date = date;

        setVoucher(obj);
    }

    const getDbAccHeads = async (ser) => {
        var q;

        if (ser === "CR") {
            q = query(accHeadsCollectionRef, where("type", "==", "Cash"), where("active", "==", true), orderBy("name"))
        }

        if (ser === "BR") {
            q = query(accHeadsCollectionRef, where("type", "==", "Bank"), where("active", "==", true), orderBy("name"))
        }

        if (ser === "CV") {
            q = query(accHeadsCollectionRef, where("type", "in", ["Cash", "Bank"]), where("active", "==", true), orderBy("name"))
        }

        if (ser === "JV" || ser === "CP" || ser === "BP") {
            q = query(accHeadsCollectionRef, where("type", "not-in", ["Cash", "Bank"]), where("active", "==", true), orderBy("type", "name"))
        }

        const data = await getDocs(q);

        //setDbAccHeads(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        var arr = [{ name: '', id: '' }];
        data.docs.map((doc) => {
            if (doc.data().active)
                arr.push({ ...doc.data(), id: doc.id })
            return doc;
        })
        return arr;
    }

    const getCrAccHeads = async (ser) => {
        var q;

        if (ser === "CP") {
            q = query(accHeadsCollectionRef, where("type", "==", "Cash"), where("active", "==", true), orderBy("name"))
        }

        if (ser === "BP") {
            q = query(accHeadsCollectionRef, where("type", "==", "Bank"), where("active", "==", true), orderBy("name"))
        }

        if (ser === "CR") {
            q = query(accHeadsCollectionRef, where("type", "not-in", ["Cash", "Bank"]), where("active", "==", true), orderBy("type", "name"))
        }

        if (ser === "BR") {
            q = query(accHeadsCollectionRef, where("type", "not-in", ["Cash", "Bank"]), where("active", "==", true), orderBy("type", "name"))
        }

        if (ser === "CV") {
            q = query(accHeadsCollectionRef, where("type", "in", ["Cash", "Bank"]), where("active", "==", true), orderBy("name"))
        }

        if (ser === "JV") {
            q = query(accHeadsCollectionRef, where("type", "not-in", ["Cash", "Bank"]), where("active", "==", true), orderBy("type", "name"))
        }

        try {

            const data = await getDocs(q);

            //setCrAccHeads(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            var arr = [{ name: '', id: '' }];
            data.docs.map((doc) => {
                if (doc.data().active)
                    arr.push({ ...doc.data(), id: doc.id })
                return doc;
            })
            return arr;
        }

        catch (err) {
            console.log(err);
            return null;
        }

    }


    useEffect(() => {
        let isMounted = true;

        const getVoucher = async (id) => {
            const docRef = doc(db, "vouchers", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let defaultSeries = docSnap.data().series;
                const db_acc_name = "" //dbAccHead.name
                const cr_acc_name = "" //crAccHead.name
                const obj = {
                    series: docSnap.data().series,
                    date: docSnap.data().date.toDate(),
                    db_acc_name: db_acc_name,
                    cr_acc_name: cr_acc_name,
                    db_acc_id: docSnap.data().db_acc_id,
                    cr_acc_id: docSnap.data().cr_acc_id,
                    amt: docSnap.data().amt,
                    narr: docSnap.data().narr,
                }
                return obj;
            }
            return null;
        }

        getVoucher(vouId.id).then(data => {
            if (isMounted) {
                setSeries(data.series);
                assignHeader(data.series);
                let dbAccHead;
                let crAccHead;

                getDbAccHeads(data.series).then(arr => {
                    dbAccHead = findArrayElementById(arr, data.db_acc_id)
                    data.db_acc_name = dbAccHead.name;
                    setDbAccHeads(arr);
                    getCrAccHeads(data.series).then(arr => {
                        crAccHead = findArrayElementById(arr, data.cr_acc_id)
                        data.cr_acc_name = crAccHead.name;
                        setCrAccHeads(arr);
                        setVoucher(data);
                    });
                });

                setState("default");
            }
        });

        return () => { isMounted = false }
    }, [])


    var html;




    if (state === "default") {
        html =
            <div class="container">
                <div className="text-left mb-3 mt-3">
                     <Link  to="/ledger" >Back</Link>
                </div>
               <h1 className="text-center">Update {header} Voucher</h1>
                <form method='post' action="#">
                    <div className="row mb-3">
                        <label for="type" className="form-label col-sm-2">Series</label>
                        <div className="col-sm-10">
                            <select name="series" value={voucher.series} className="form-control" onChange={(e) => handleChange(e)}>
                                {seriesList && seriesList.map((item, index) => {
                                    return (
                                        <option key={item}>{item}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="form-label col-sm-2">Date</label>
                        <div className='col-sm-10'>
                            <DatePicker selected={voucher.date} dateFormat="dd-MM-yyyy"
                                onChange={(date) => handleDateChange(date)} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="db_acc_name" className="form-label col-sm-2">Debit Account</label>
                        <div className="col-sm-10">
                            <select name="db_acc_name" value={voucher.db_acc_name} className="form-control" onChange={(e) => handleChange(e)}>
                                {dbAccHeads && dbAccHeads.map((obj, index) => {
                                    return (
                                        <option key={obj.id}>{obj.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="cr_acc_name" className="form-label col-sm-2">Credit Account</label>
                        <div className="col-sm-10">
                            <select name="cr_acc_name" value={voucher.cr_acc_name} className="form-control" onChange={(e) => handleChange(e)}>
                                {crAccHeads && crAccHeads.map((obj, index) => {
                                    return (
                                        <option key={obj.id}>{obj.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="amt" className="form-label col-sm-2">Amount</label>
                        <div className="col-sm-10">
                            <input type="text" name="amt" className="form-control"
                                id="amt" value={voucher.amt} onChange={(e) => handleChange(e)}></input>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="narr" className="form-label col-sm-2">Narration</label>
                        <div className="col-sm-10">
                            <input type="text" name="narr" className="form-control"
                                id="amt" value={voucher.narr} onChange={(e) => handleChange(e)}></input>
                        </div>
                    </div>


                    <div class="text-center">
                        <button className="btn btn-primary me-2"
                            onClick={(e) => { updateVoucher(e) }} disabled={flag}>Update</button>

                        <button className="btn btn-danger me-2"
                            onClick={(e) => { deleteVoucher(e) }}>Delete</button>

                    

                    </div>
                </form>
            </div>
    }

    if (state === "back") {

        html = <Ledger />
    }

    return (
        <div>
            {html}
        </div>
    )
}

export default ModifyVoucher
