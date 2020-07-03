import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Tooltip , IconButton} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Zoom from '@material-ui/core/Zoom';

import './Controls.css'
const useStyles = makeStyles({
    root: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      color: 'white',
      height: 48,
      padding: '0 15px'
    },
    disabledStyle:{
        background: 'linear-gradient(45deg, #2b2b2b 30%, #575757 90%)',
        border: 0,
        borderRadius: 3,
        color: 'white',
        height: 48,
        padding: '0 15px'
    }
  });

const Controls = (props) => {
    let styleClasses=useStyles();
    const [toolTipText, setToolTipText] = useState('');
    const [style, setStyle] = useState(null);
    useEffect(() => {
        if (!props.disabled){
            setToolTipText('You don\'t have permission to do this');
            setStyle(styleClasses.disabledStyle);
        } else {
            setToolTipText('');
            setStyle(styleClasses.root);
        }

    }, [props.disabled]);


    return (
        <div className='controls'>
            <div className='playButtons'>
                <Tooltip title={toolTipText} TransitionComponent={Zoom}  aria-label="add" arrow> 
                    <span>
                        <Button variant="contained" disabled={!props.disabled} className={style}  color="secondary" onClick={() => props.playPrevious()}>
                            Play Previous
                        </Button>
                    </span>
                </Tooltip>
                <Tooltip title={toolTipText} TransitionComponent={Zoom}  aria-label="add" arrow> 
                    <span>
                        <Button variant="contained" disabled={!props.disabled} className={style} color="secondary" onClick={() => props.playNext()}>
                            Play Next
                        </Button>
                    </span>
                </Tooltip>
            </div>
            <div className="addToQueue">
                <Tooltip title={toolTipText} TransitionComponent={Zoom}  aria-label="add" arrow> 
                    <div className="text">
                        <span>
                            <TextField fullWidth id="videoLink" disabled={!props.disabled} label="New Video Link" color='secondary' value={props.nextVidLink} onChange={props.setChangeVid}  error={props.vidLinkError} helperText={props.videoLinkHelperText} />
                        </span>
                    </div>
                </Tooltip>

                <Tooltip title={toolTipText} TransitionComponent={Zoom}  aria-label="add" arrow> 
                    <div className="btn">
                        <span>
                            <Tooltip title="Add" aria-label="add">
                                <IconButton variant="contained" disabled={!props.disabled}  aria-label="Add to Queue" onClick={() => props.addQueue()}>
                                    <AddCircleIcon color='secondary' fontSize='large' />
                                </IconButton>
                            </Tooltip>
                        </span>
                    </div>  
                </Tooltip>

            </div>
        </div>
    );
}

export default Controls;
