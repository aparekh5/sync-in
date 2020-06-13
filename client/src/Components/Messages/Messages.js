import React, {useEffect} from 'react'
import './Messages.css'
import { animateScroll } from "react-scroll";
import Message from '../Message/Message'
export default function Messages({messages}) {

    let scrollToBottom = () => {
        animateScroll.scrollToBottom({
          containerId: "messages"
        });
    }

    useEffect(() => {
        scrollToBottom();
    });



      
     


    return (
            <div className="messages" id='messages'>
            {messages.map((message, i) => <div key={i}>
                <Message message={message} />               
            </div>)}
            <div style={{ float:"left", clear: "both" }}
             >
            </div>
            </div>

    )
}
