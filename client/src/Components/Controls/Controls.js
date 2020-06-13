import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Tooltip , IconButton} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import './Controls.css'
const useStyles = makeStyles({
    root: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      color: 'white',
      height: 48,
      padding: '0 15px',
    },
  });

const Controls = (props) => {
    let styleClasses=useStyles();
    return (
        <div className='controls'>
            <div className='playButtons'>
                <Button variant="contained" className={styleClasses.root}  color="secondary" onClick={() => props.playPrevious()}>
                    Play Previous
                </Button>
                <Button variant="contained" className={styleClasses.root} color="secondary" onClick={() => props.playNext()}>
                    Play Next
                </Button>
            </div>
            <div className="addToQueue">
                <div className="text">
                    <TextField fullWidth id="videoLink" label="New Video Link" color='secondary' value={props.nextVidLink} onChange={props.setChangeVid}  error={props.vidLinkError} helperText={props.videoLinkHelperText} />
                </div>
                <div className="btn">
                    <Tooltip title="Add" aria-label="add">
                        <IconButton variant="contained"  aria-label="Add to Queue" onClick={() => props.addQueue()}>
                            <AddCircleIcon color='secondary' fontSize='large' />
                        </IconButton>
                    </Tooltip>
                </div>  
            </div>
        </div>
    );
}

export default Controls;
