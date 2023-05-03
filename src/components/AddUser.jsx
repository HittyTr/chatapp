import React, { useState } from 'react';
import {auth, db} from '../firebase/firebase'
import { doc, updateDoc,getDoc, setDoc } from 'firebase/firestore'
import { Button, Form } from 'react-bootstrap';


const AddUser = ({userList}) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState('');
    const handleSearchChange = (e) => {
        setInput(e.target.value);
    }
    const handleFirstmessage = async(id) => {
        await setDoc(doc(db, "users", `${auth.currentUser.uid}`, 'userdata','messages',`${id}`,'messagelist'),{
            list:[],
        })
        await setDoc(doc(db, "users", `${id}`, 'userdata','messages',`${auth.currentUser.uid}`,'messagelist'),{
            list:[],
        })
     
}
    const handleSearch= async(e) => {
        e.preventDefault();
        let correctsearch=input.trim().toLowerCase();
        const docRef = doc(db, "user", `${correctsearch}`);
        const docSnap = await getDoc(docRef);
        const id=docSnap.data().userId;
        const photoUrl=docSnap.data().photoUrl;
        if(id===auth.currentUser.uid){
            setError('You cannot add yourself');
            setInput("");
            return
        }
        else if(userList.some((user)=>user.id===id)){
            setError('User already added');
            setInput("");
            return
        }
        const name=docSnap.data().name;
        const userRef = doc(db, "users", `${auth.currentUser.uid}`, 'userdata','userlist');
        const userSnap = await getDoc(userRef);
        const userListdb=userSnap.data().userlist;
        const otherUserRef = doc(db, "users", `${id}`, 'userdata','userlist');
        const otherUserSnap = await getDoc(otherUserRef);
        const otherUserList=otherUserSnap.data().userlist;

        if (docSnap.exists()) {
            handleFirstmessage(id)
        } else {
            console.log("No such document!");
        }
       
        await updateDoc(doc(db, "users", `${auth.currentUser.uid}`, 'userdata','userlist'), {
            userlist: [...userListdb,{id:id,name:name,photoUrl:photoUrl}]
        })
        await updateDoc(otherUserRef, {
            userlist: [...otherUserList,{id:auth.currentUser.uid,name:auth.currentUser.displayName,photoUrl:auth.currentUser.photoURL}]
        })
        ;
        setInput("");
    }

    const handleErrorClick = () => {
        setError('');
    }

    return (
            <Form onSubmit={handleSearch}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control onClick={()=>handleErrorClick()} onChange={handleSearchChange} value={input&&input} type="email" placeholder="Enter email" />
                    <Form.Text  className="text-muted">
                        {error===''?'Add a user to start chatting':error}
                    </Form.Text>
                </Form.Group>
                <Button type='submit'> Search User</Button>
            </Form>
    )
}

export default AddUser;