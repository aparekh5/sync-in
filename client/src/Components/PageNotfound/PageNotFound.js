import React from 'react'
import './PageNotFound.css'

export default function PageNotFound() {
    return (
        <div className='error-404-wrapper'>
            <div className='error-404'>
                <h1 className='errorcode'> 404 </h1>
                <h1 className='description'> This page could not be found.</h1>
            </div>
        </div>
    )
}
