

const Message = ({ message, sender,time }) => {
    return (
        <div className={`${sender ?'message__sender':'message__receiver'}`}>
            <div className="message__info">
                <p className="message-description">{message}</p>
                <span className="time">{time}</span>
            </div>
        </div>
    )
}

export default Message;