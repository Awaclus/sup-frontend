import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Hamburger from 'hamburger-react';

import MenuItem from './MenuItem';

import logo from '../assets/logo_vertical.png';

const CATEGORIES = gql`
    query GetNavbarCategories {
        sivut {
            Otsikko,
            Osoite,
            PiilotaValikosta
        }
    }
`

export default function SiteHeader() {
    const { loading, error, data } = useQuery(CATEGORIES);
    const [open, setOpen] = useState(false);

    if (loading) return <p>Ladataan...</p>



    try{
        return (
            <>
            <div className="site-header">
            <Link to="/" className="logo"><img src={logo} alt='Sulkavan pursiseuran logo' className='header-logo'></img></Link>
            <nav className="categories">
                {data.sivut.map(category => {
                    if (category.PiilotaValikosta) {
                        return null;
                    } else {
                    return (
                    <MenuItem 
                        key={category.Osoite}
                        to={category.Osoite}
                        title={category.Otsikko}
                        className="category">

                    </MenuItem>
                )}})}
            </nav>
            <Hamburger
             toggled={open}
             toggle={setOpen}
             className="hamburger"
            />
            </div>
            {open && <div className="mobile-menu">
                {data.sivut.map(category => {
                    if (category.PiilotaValikosta) {
                        return null;
                    } else {
                        return (
                            <a href={category.Osoite}>{category.Otsikko}</a>
                        )
                    }
                })}
            </div>}
            </>
        )
    } catch {
        return <p>Virhe ladattaessa kategorioita: {error}</p>
    }
        
}
