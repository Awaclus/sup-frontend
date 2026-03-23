import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function MenuItem(props) {



        return (
            <>
                <span className='categorySpan'>
                    <Link to={props.to} className={props.className}>{props.title}</Link>
                </span>
            </>
        )
    
}
