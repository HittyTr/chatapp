import React, {  useEffect, useState } from 'react';
import Chat from './Chat';
import User from './User';
import {auth, db} from '../firebase/firebase'
import { doc, updateDoc,getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import AddUser from './AddUser';
import { Button, Col, Container,Row,Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';


const Home = () => {
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [chat, setChat] = useState([]);
    const {user,dispatch}=useContext(UserContext);
    const [userList, setUserList] = useState([]);


    
    
    const handleChange = (e) => {
        setMessage(e.target.value);
    }
    const handleUserChange = (id) => {
        setSelectedUser(id);
    }
  
    const handleSend =  async(e) => {
        e.preventDefault();
        const timestamp=Timestamp.now().toDate();
        const sentmessage={
            message:message,
            time:timestamp,
            senderId:auth.currentUser.uid,
        }
        const sendingRef = doc(db, "users", `${auth.currentUser.uid}`, 'userdata','messages',`${selectedUser}`,'messagelist');
        const receivingRef = doc(db, "users", `${selectedUser}`, 'userdata','messages',`${auth.currentUser.uid}`,'messagelist');

        if(chat.length===0){
            await setDoc(sendingRef,{
                list:[sentmessage]
            })
            await setDoc(receivingRef,{
                list:[sentmessage]
            })
            setMessage("")
            return
        }
        else if(chat.length>0){
            await updateDoc(sendingRef, {
                list:[...chat,sentmessage]
            })
            await updateDoc(receivingRef, {
                list:[...chat,sentmessage]
            })
            setMessage("")
            return
        }
       
    }

    const fetchMessages= async(id)=>{
        const messageref = doc(db, "users", `${auth.currentUser.uid}`,'userdata','messages',`${id}`,'messagelist');
        const messagesnap = await getDoc(messageref);

        if (messagesnap.exists()) {
            const unsubscribe=onSnapshot(messageref, (doc) => {
                setChat(doc.data().list)
            });
            return () => {
                unsubscribe()
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    const fetchUserList = async() => {
        const docRef = doc(db, "users", `${user.uid}`,'userdata','userlist');
        const unsubscribe=onSnapshot(docRef, (doc) => {
        setUserList(doc.data().userlist)
            });
        return () => {
            unsubscribe()
        }
        
    }
    useEffect(() => {
        fetchUserList()
    }, [])

    useEffect(() => {
        if(selectedUser){
            fetchMessages(selectedUser) 
        }
    }, [selectedUser])
    
    return (
        <Container>
            <Row>
            <Col xs={2}><Link to={'/'}><h2 className='app-title'>ChatApp</h2></Link></Col>
            <Col><Link to={'/profile'}>{user.photoURL?<img className='profile-img' src={user.photoURL} alt='profile'/>:<Button>P</Button>}</Link></Col>
            </Row>
           <Row className='h-100'>
           <Col className='userArea' xs={3}>
              <div className='addUser'>
                <div className='addUser-title'>New Conversation</div>
                <AddUser
                userList={userList}
                />
                </div>
               <div className='userlist-cont'>
               {userList.length>0&&userList.map((user,index) => {
                console.log(user)
                    return <User
                     username={user.name}
                     key={index}
                     id={user.id}
                     handleUserSelect={handleUserChange}
                     photoURL={user.photoURL}
                     />
                }
                )}
               </div>
               
            </Col>
            <Col className='chat-area' xs={8}>
               <Chat
               chat={chat}
               />
               <Form onSubmit={handleSend}>
                <Form.Group className="sender-area">
                    <Form.Control onChange={handleChange} type='text' value={message&&message} rows={2} />
                    <Button disabled={message.length===0} className='sender-btn' type='submit'> {message.length===0?'Write':'Send'}</Button>
                </Form.Group>
                
               </Form>
            
            
            </Col>
           </Row>
            
            
        </Container>
    )
}

export default Home;