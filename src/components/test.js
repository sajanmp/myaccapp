import React, { useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore/lite';

function Test() {
    const voucherCollectionRef = collection(db, "vouchers");
    const accHeadsCollectionRef = collection(db, "accheads");
    const fromDate = new Date("2022/01/01");
    const tillDate = new Date("2022/01/26")

    useEffect(() => {
        const acc_id = "94NV1lEbibLEpHQ39iYo"

        const debitVouchers = async () => {
            const q = query(voucherCollectionRef,
                where("date", "<", tillDate),
                where("db_acc_id", "==", acc_id),
                orderBy("date"))
            const data = await getDocs(q);
            console.log("1");
            return data.docs;
        }

        const creditVouchers = async () => {
            const q = query(voucherCollectionRef,
                where("date", "<", tillDate),
                where("cr_acc_id", "==", acc_id),
                orderBy("date"))
            const data = await getDocs(q);
            console.log("2");
            return data.docs;
        }


        const accHeads = async () => {
            const q = query(accHeadsCollectionRef,
                where("type", "not-in", ["Cash", "Bank"]),
                where("active", "==", true),
                orderBy("type", "name"))

            const data = await getDocs(q);
            console.log("3")
        }

        accHeads().then(() => {
            debitVouchers().then((dbarr) => {
                creditVouchers().then((crarr) => {
                    console.log(dbarr);
                    console.log(crarr);
                    const joinedArr = dbarr.concat(crarr);
                    var unionArr = [];
                    joinedArr.map((obj)=>{
                        unionArr.push(obj.data());
                        return obj;
                    })
                    console.log(unionArr);
                    //const sortedArr = unionArr.sort((a,b)=> new Date(...a.date.toDate()));

                    /*
                    unionArr.sort(function compare(a,b) {
                        var dateA = new Date(a.date.toDate());
                        var dateB = new Date(b.date.toDate());
                        return dateA - dateB;

                    })
                    */

                    unionArr.sort((a,b) => {
                        var dateA = new Date(a.date.toDate());
                        var dateB = new Date(b.date.toDate());
                        return dateA - dateB; //ascending order
                        //return dateB - dateA; //descending order
                    })


                    unionArr.map((obj)=>{
                        console.log(obj.date.toDate(), obj.amt);
                        return obj;
                    })
                    console.log("4");
                })
            });
        });
    }, [])

    return (
        <div>
            <h1>This is test component</h1>
        </div>
    )
}

export default Test;

