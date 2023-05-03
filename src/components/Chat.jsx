import { auth } from '../firebase/firebase'
import Message from './Message';
import { useEffect, useRef } from 'react';

const Chat = ({chat}) => {
    const containerRef = useRef(null);
    const scrollToBottom = () => {
        containerRef.current.scrollIntoView();
    }
    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handlesender = (senderId) => {
        if (senderId === auth.currentUser.uid) {
            return true;
        }
        else {
            return false;
        }
    }
    const handletimeCorrect = (time) => {
       let corrtime=new Date(time.seconds*1000).toLocaleString()
       let hourMinute = corrtime.split(',')[1];
       let ampm=hourMinute.split(' ')[2];
       let hour=hourMinute.split(':')[0];
       let minute=hourMinute.split(':')[1];
         return `${hour}:${minute} ${ampm}` ;
    }
    const handleReverse = (arr) => {
        let reversedChat = arr.reverse();
        console.log(arr)
        return reversedChat;
    }
    
    return (
            <div className="chat" >
                {chat.length>0 &&handleReverse(chat).map((message,index) => (
                    <Message
                    key={index}
                    time={handletimeCorrect(message.time)}
                    message={message.message}
                    sender={handlesender(message.senderId)}   
                    />
                ))}
                <div ref={containerRef}></div>
            </div>
       
    )
}

export default Chat;