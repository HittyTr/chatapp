import profile from '../Img/profile.png'

const User = ({username,id,handleUserSelect,photoURL}) => {
    return (
        <div className="user" onClick={()=>{handleUserSelect(id)}}>
            {photoURL?<img  className='tiny-profile' src={photoURL} alt='profile'/>:<img className='tiny-profile' src={profile} alt='profile' />}
            {username}
        </div>
    )
}

export default User;