import React from 'react'
import './Message.css'
export default function Message({message}) {
    let isSentByCurrentUser = false;
    if (message.user =='current_user') {
        isSentByCurrentUser = true;
        console.log(isSentByCurrentUser)
    }
    return (
        isSentByCurrentUser 
        ? (
            <div className='messageContainer justifyEnd'>
            <div className="messageBox backgroundOrange">
                <p className="messageText colorWhite">{message.message}</p>
            </div>
            </div>
        )
        : (
            <div className='messageContainer justifyStart'>
            <div className="messageBox backgroundLight">
                <p className="messageText colorDark">{message.message}</p>
            </div>
            <p className="sentText pl-10">{message.user}</p>
            </div>

        )
    )
}
