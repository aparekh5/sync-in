import React, { Component } from 'react'
import './Navbar.css'
import {Link} from 'react-router-dom'

export default class Navbar extends Component {

    render() {
        return (
            <div>
                <div className='navbar'>
                    <Link to='/' className='Logo'> Sync In</Link>
                    <ul className='nav-links'>
                        <li><Link to='/host'>Host</Link></li>
                        <li><a className='bug' href='https://github.com/aparekh5/sync-in-bug-reporting' target='_blank'>Report A Bug</a></li>
                       
                    </ul>
                </div>
                
            </div>
        );
    }
}
