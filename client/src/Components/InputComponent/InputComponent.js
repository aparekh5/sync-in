import React from 'react'
import './InputComponent.css'
import {TextField, IconButton, Icon} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

export default function InputComponent({message, sendMessage, setMessage}) {
    return (
        <div className='input-wrapper'>
            <div className="textField">
                <TextField 
                    fullWidth
                    placeholder='Type a message...'
                    onKeyPress={event => event.key ==='Enter' ? sendMessage(event) : null}
                    value={message}
                    onChange={(event => setMessage(event))}
                />
            </div>
            <div className="btn-icon">
                <IconButton aria-label="send" onClick={(event) => sendMessage(event)} color="primary">
                    <SendIcon color='secondary' />
                </IconButton>
            </div>
        </div>
    )
}
