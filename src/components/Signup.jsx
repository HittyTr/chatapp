import React,{useContext, useState} from 'react'
import { Button, Container, Form, Spinner } from 'react-bootstrap'
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'
import {auth,db} from '../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { setDoc, doc } from 'firebase/firestore'
import { UserContext } from '../contexts/UserContext'

const Signup = () => {
    const [info,setInfo]=useState({
        name:'',email:'',password:'',error:'',loading:false
    })
    const {dispatch}=useContext(UserContext)
    const navigate= useNavigate()
    
    const validateForm = () => {
        return info.email.trim().length > 0 && info.password.trim().length > 0 && info.name.trim().length > 0;
        }

    const handleSubmit =  (e) => {
        e.preventDefault();
        if(!validateForm()){
            setInfo({...info,error:'Please fill in all fields'})
            return
        }
       setInfo({...info,loading:true})
        createUserWithEmailAndPassword(auth, info.email, info.password)
        .then(() => {
            
            setDoc(doc(db,'users',`${auth.currentUser.uid}`,'userdata','userlist'),{
                userlist:[],
                })
            setDoc(doc(db,'user',`${auth.currentUser.email}`),{
                userId:auth.currentUser.uid,
                name:info.name,
        })
        })
        .then(() => {
            setInfo({...info,loading:false})
        })
        .then(()=>
        {
            updateProfile( auth.currentUser,{
                displayName: info.name
            })
        })
        .then(() => {
            dispatch({type:'SET_USER',payload:auth.currentUser})
            setTimeout(() => {
                navigate('/home')
            }, 1500);
        })
        .catch((error) => {
            setInfo({...info,error:error.code,loading:false})
            console.log(error.message)
        });
        
    }
    const handleChange = (e) => {
        setInfo({...info,[e.target.name]:e.target.value})
    }

    const handleClick = () => {
        setInfo({...info,error:''})
    }

    
    return (
        <Container className="register">
             <h2 className="  text-center header"> Chat App Demo with Firebase</h2>
        <Form  onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control onClick={()=>handleClick} onChange={handleChange} name="name" type="text" placeholder="Enter your name" />
                <Form.Label>Email address</Form.Label>
                <Form.Control onClick={()=>handleClick} onChange={handleChange} name="email" type="email" placeholder="Enter email" />
                <Form.Label>Password</Form.Label>
                <Form.Control onClick={()=>handleClick} onChange={handleChange} name="password" type="password" placeholder="Password" />
            </Form.Group>
            <div className="text-center"><Button className="mt-3 " style={{width:'85px'}} variant="outline-secondary" type="submit">{info.loading?<Spinner animation="border" size ='sm' variant="secondary" />:'Register'}  </Button></div>
            <div className="text-center mt-1"><span className="clickHere" onClick={()=>navigate('/')} >Click Here</span> for Homepage</div>
        </Form>
        {info.error==='auth/email-already-in-use'&&<span style={{ color:'red'}} >Email adresi kullanilmaktadir </span>}
        {info.error==='auth/invalid-email'&&<span style={{ color:'red'}} >Email adresi gecersizdir </span>}
        {info.error==='auth/weak-password'&&<span style={{ color:'red'}} >Sifre en az 6 karakterden olusmalidir </span>}
        {info.error==='Please fill in all fields'&&<span style={{ color:'red'}} >Lutfen tum alanlari doldurunuz </span>}
        </Container>
        
        )
    }

    export default Signup;