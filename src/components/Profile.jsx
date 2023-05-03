import { Card, Container,Row,Button } from "react-bootstrap"
import { auth } from "../firebase/firebase"
import profile from '../Img/profile.png'
import{storage} from '../firebase/firebase'
import { ref, uploadBytesResumable,getDownloadURL} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

const Profile = () => {
    const {user,dispatch}=useContext(UserContext);
    const navigate=useNavigate();
    const handleUpload = (e) => {
    
        const file = e.target.files[0];
        const storageRef = ref(storage, `${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                console.log(snapshot)
            },
            (error) => {
                console.log(error);
            },
            async()=>{
                updateProfile(auth.currentUser,{
                    photoURL: await getDownloadURL(ref(storage, `${user.uid}`))
                })
                
                dispatch({type:'SET_USER',payload:auth.currentUser})
                setDoc(doc(db, "user", `${user.email}`), {
                    photoURL: await getDownloadURL(ref(storage, `${user.uid}`))
                }, { merge: true });
            }
        )
    
    }
    console.log(user)
    return (
     <Container className="profile-container">
        <Button onClick={()=> navigate(-1)}>Home</Button>
        <Row className="profile-card">
           <Card>
                <Card.Body>
                <input onChange={handleUpload} type="file" name="uploadfile" id="img" style={{display:'none'}}/>
                    <label style={{display:'flex',justifyContent:'center'}}  htmlFor="img"><img className="profile-img"  alt='profile' src={user.photoURL?user.photoURL:profile} /></label>
                
                    <Card.Text>
                       <span className="profile-bold">Username:{user.displayName}</span> 
                        <span className="profile-bold">Email:{user.email}</span> 
                    </Card.Text>
                </Card.Body>
           </Card>
        </Row>
     </Container>
    )
}

export default Profile