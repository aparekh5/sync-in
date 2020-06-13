import React from 'react';
import './Infobar.css'
const Infobar = ({hostName}) => {
    return (
        <div className='infoBar'>
            <div className="leftInnerContainer">
                <h3>{`${hostName}'s Party`}</h3>
            </div>
            
        </div>
    );
}

export default Infobar;
