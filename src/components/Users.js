import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc} from 'firebase/firestore/lite';
import { db } from './config/firebase'


function Users() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [users, setUsers] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const usersCollectionRef = collection(db, "users");

 const createUser = async () => {
   await addDoc(usersCollectionRef,{first: firstName, last: lastName})

 }

 const handleEdit = (index) => {
   console.log(index);
   setCurrIndex(index);
   console.log(users[index]);
   setFirstName(users[index].first);
   setLastName(users[index].last);
 }

 const updateUser = async() => {
   try {
    const id = users[currIndex].id;
    const userDoc = doc(db,"users",id);
    const data = {first: firstName, last: lastName}
    await updateDoc(userDoc,data);
   }
   catch (err) {
     alert(err);
   }

 }

 const deleteUser = async(index) => {
   try
    { 
    const id = users[index].id;
    const userDoc = doc(db,"users",id);
    if (!userDoc.exists)
       {
         alert("Document not found");
         return;
       } 
    await deleteDoc(userDoc);
   }
   catch (err) 
   {
     alert(err);
   }
 }
 
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    };

    getUsers();
  }, [])

  return (
    <div className="App">
      <input placeholder='First Name'  value = {firstName} onChange={e=>setFirstName(e.target.value)}/>
      <input placeholder='Last Name' value = {lastName} onChange={e=>setLastName(e.target.value)}/>
      {currIndex === -1 
         ? <button onClick={createUser}>Create User</button>
         : <button onClick={updateUser}>Update</button>
      }
      {users && users.map((user, index) => {
        return (
          <div>
          <h1>{user.first} {user.last}
          <button onClick={()=>{handleEdit(index)}}>Edit</button>
          <button onClick={()=>{deleteUser(index)}}>Delete</button>
          </h1>
          </div>
        )
      })}

    </div>
  );
}

export default Users;
