import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore/lite';
import { useLocation } from 'react-router-dom';
import { db } from '../config/firebase';
import Moment from 'moment';
import { Outlet, Link } from "react-router-dom";

function LedgerReport() {
    const search = useLocation().search;
    let params = {}
    params.fromDate = new URLSearchParams(search).get('fromdate');
    params.tillDate = new URLSearchParams(search).get('tilldate');
    params.accHead = new URLSearchParams(search).get('fromdate');
    params.accId = "";
    params.opBal = 0;

    params.fromDate = new Date(params.fromDate);
    params.tillDate = new Date(params.tillDate)
    params.accHead = new URLSearchParams(search).get('acchead');

    const [accHeads, setAccHeads] = useState([])
    const [list, setList] = useState([])

    const accHeadsCollectionRef = collection(db, "accheads");
    const voucherCollectionRef = collection(db, "vouchers");

    const findArrayElementById = (array, id) => {
        return array.find((element) => {
            return element.id === id;
        })
    }

    const findArrayElementByName = (array, name) => {
        return array.find((element) => {
            return element.name === name;
        })
    }


    const addDays = (date, interval) => {
        const dateMilli = date.getTime();
        const endMilli = dateMilli + (interval * 1000 * 60 * 60 * 24);
        const newDate = new Date(endMilli);
        return newDate;
    }

    const generateLedger = async () => {
        const tillDate = addDays(params.tillDate, 1);
        const q = query(voucherCollectionRef, where("date", "<", tillDate), orderBy("date"))
        console.log(params.fromDate);
        console.log(tillDate)
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
            return arr;


            //setAccHeads(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        };

        if (isMounted) {
            getAccHeads().then((response) => {
                setAccHeads(response);
                let accHead = findArrayElementByName(response, params.accHead);
                if (accHead) {
                    params.accId = accHead.id;
                    params.opBal = accHead.op_debit > 0 ? accHead.op_debit : 0 - accHead.op_credit;
                }
                console.log(params.accHead);
                console.log(params.accId);
                generateLedger();
            });
        }

        return () => { isMounted = false }
    }, [])

    return (
        <div>
            <h1>Ledger Report</h1>
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
    );
}

export default LedgerReport;
