import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './InviteLink.css'
const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 20px',
  },
});


export default function InviteLink() {

    const classes = useStyles();
    return (
        <div className="invitelink-wrapper">
            <CopyToClipboard text={window.location.href}>
                <Button className={classes.root} >Copy Invite Url</Button>
            </CopyToClipboard>
        </div>
    );
}
