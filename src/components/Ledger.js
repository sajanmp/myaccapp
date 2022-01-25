import React, { useState, useEffect, useContext} from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore/lite';
import { db } from '../config/firebase';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import { Outlet, Link } from "react-router-dom";
import { UserContext } from './CreateContext';

function Ledger() {
    Moment.locale = "en"
    Moment.defaultFormat = "dd-MM-yyyy"

    const {value, setValue} = useContext(UserContext);


    const initialValue = {
        fromDate: new Date(),
        tillDate: new Date(),
        accHead: "",
        accId: "",
        opBal: 0
    }



    const handleDateChange = (date, calledFrom) => {
        var obj = { ...params };

        var formattedDate = Moment(date).format("YYYY-MM-DD");
        formattedDate = formattedDate + "T00:00:00.000z";
        var newDate = new Date(formattedDate);

        if (calledFrom === "fromDate")
            obj.fromDate = newDate;

        if (calledFrom === "tillDate")
            obj.tillDate = newDate;

        setParams(obj);

        setValue(obj);
    }

    const handleChange = (e) => {
        var obj = { ...params };

        obj.accHead = e.target.value;
        let data = findArrayElementByName(accHeads, obj.accHead);
        if (data != null) {
            obj.accId = data.id;
            obj.opBal = data.op_debit > 0 ? data.op_debit : 0 - data.op_credit;
        }
        setParams(obj);
        setValue(obj);

    }

    const findArrayElementByName = (array, name) => {
        return array.find((element) => {
            return element.name === name;
        })
    }


    const findArrayElementById = (array, id) => {
        return array.find((element) => {
            return element.id === id;
        })
    }


    const addDays = (date, interval) => {
        const dateMilli = date.getTime();
        const endMilli = dateMilli + (interval * 1000 * 60 * 60 * 24);
        const newDate = new Date(endMilli);
        return newDate;
    }

    /*
    const showVoucher = (e) => {
        setDocId(e.target.id);
        setState("voucher");
    }
    */

    const [list, setList] = useState([])
    const [accHeads, setAccHeads] = useState([])
    const [params, setParams] = useState(initialValue)
    const [state, setState] = useState("default")
    const [docId, setDocId] = useState("");



    const voucherCollectionRef = collection(db, "vouchers");
    const accHeadsCollectionRef = collection(db, "accheads");


    const generateLedger = async (e) => {
        e.preventDefault();
        const tillDate = addDays(params.tillDate, 1);
        const q = query(voucherCollectionRef, where("date", "<", tillDate), orderBy("date"))
        const data = await getDocs(q);
        const arr = [];


        var runningBal = params.opBal;
        var opFlag = true;

        data.docs.map((doc) => {
            if (doc.data().db_acc_id === params.accId || doc.data().cr_acc_id === params.accId) {
                let date = doc.data().date.toDate();
                if (date >= params.fromDate && date < tillDate) {
                    if (opFlag) {
                        if (runningBal !== 0) {
                            arr.push({
                                id: 0,
                                date: Moment(params.fromDate).format("DD-MM-YYYY"),
                                series: "",
                                accHead: "Opening Balance",
                                debit: runningBal > 0 ? runningBal : null,
                                credit: runningBal < 0 ? 0 - runningBal : null,
                                narr: "",
                                runningBal: runningBal
                            })
                        }
                        opFlag = false;
                    }
                }
                const dbAccHead = findArrayElementById(accHeads, doc.data().db_acc_id);
                const crAccHead = findArrayElementById(accHeads, doc.data().cr_acc_id);
                const accHead = dbAccHead.name === params.accHead ? crAccHead.name : dbAccHead.name;
                const debit = dbAccHead.name === params.accHead ? doc.data().amt : null;
                const credit = crAccHead.name === params.accHead ? doc.data().amt : null;
                if (debit != null)
                    runningBal = runningBal + debit
                else
                    runningBal = runningBal - credit
                if (date >= params.fromDate && date <= tillDate) {
                    arr.push({
                        id: doc.id,
                        date: Moment(date).format("DD-MM-YYYY"),
                        series: doc.data().series,
                        accHead: accHead,
                        debit: debit,
                        credit: credit,
                        narr: doc.data().narr,
                        runningBal: runningBal
                    })
                }
            }
            return doc;
        })
        setList(arr);
    }


    useEffect(() => {
        let isMounted = true;

        const getAccHeads = async () => {
            const q = query(accHeadsCollectionRef, orderBy("name"))
            const data = await getDocs(q);
            var arr = [{ name: '', id: '' }];
            data.docs.map((doc) => {
                if (doc.data().active)
                    arr.push({ ...doc.data(), id: doc.id })
                return doc;
            })
            setAccHeads(arr);
            //setAccHeads(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        };

        if (isMounted) {
            getAccHeads();

            handleDateChange(new Date(), "fromDate");
            handleDateChange(new Date(), "tillDate");

            if (value.fromDate !== undefined) {
                console.log(value);
               setParams(value);
            }
        }

        return () => { isMounted = false }

    }, [])

    var html;

    if (state === "default") {
        html =
            <div class="container">
                 <div className="text-left mb-3 mt-3">
                     <Link  to="/" >Back</Link>
                </div>
                <h1 className="text-center">Ledger</h1>
                <form method='post' action="#">
                    <div className="row mb-3">
                        <label className="form-label col-sm-2">From Date</label>
                        <div className='col-sm-10'>
                            <DatePicker selected={params.fromDate} dateFormat="dd-MM-yyyy"
                                disableClock={true}
                                onChange={(date) => handleDateChange(date, "fromDate")} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="form-label col-sm-2">Till Date</label>
                        <div className='col-sm-10'>
                            <DatePicker selected={params.tillDate} dateFormat="dd-MM-yyyy"
                                onChange={(date) => handleDateChange(date, "tillDate")} />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label for="db_acc_name" className="form-label col-sm-2">Account Head</label>
                        <div className="col-sm-10">
                            <select name="acc_head" value={params.accHead} className="form-control"
                                onChange={(e) => handleChange(e)}>
                                {accHeads && accHeads.map((obj, index) => {
                                    return (
                                        <option key={obj.id}>{obj.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="text-center btn-primary mb-3 mt-5">
                        {/*
                        <Link className="text-white"
                            to={{
                                pathname: `/ledgerreport?fromdate=${Moment(params.fromDate).format("YYYY-MM-DD")}
                                                &tilldate=${Moment(params.tillDate).format("YYYY-MM-DD")}
                                                &acchead=${params.accHead}`
                            }}
                            style={{ "text-decoration": "none" }}>
                            Show
                        </Link>
                        */}


                        <button className="btn btn-primary me-2 pb-3"
                            onClick={(e) => { generateLedger(e) }}>Show
                        </button>

                    </div>
                </form>
                {list ?
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Account Head</th>
                                <th>Type</th>
                                <th>Debit</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list && list.map((obj, index) => {
                                return (
                                    <tr>
                                        <td id={obj.id}>
                                            <Link
                                                key={obj.id}
                                                style={{ "text-decoration": "none" }}
                                                to={{ pathname: `/modifyvoucher/${obj.id}` }}>
                                                {obj.date}
                                            </Link>
                                        </td>
                                        <td>
                                            {obj.accHead}
                                            <br />
                                            Balance: {obj.runningBal}
                                        </td>
                                        <td>{obj.series}</td>
                                        <td>{obj.debit}</td>
                                        <td>{obj.credit}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    : null}
                <Outlet />
            </div>
    }

    return (
        <div>
            {html}
        </div>
    )

}

export default Ledger


