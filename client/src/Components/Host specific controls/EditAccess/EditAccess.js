import React from 'react'
import './EditAccess.css'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 10px',
  },
});


export default function EditAccess(props) {
    const classes = useStyles();

    let btnText = (props.userHasEditAccess ? 'Disable' : 'Enable')  + ' User Edit Access';

    return (
        <div className="editaccess-wrapper">
                <Button onClick={() => props.editAccessHandler(!props.userHasEditAccess)} className={classes.root}>{btnText}</Button>
        </div>
    )
}
