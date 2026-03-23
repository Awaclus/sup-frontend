import React, { Component } from 'react'
import { HashLink as Link } from 'react-router-hash-link'; 

import logo from '../assets/logo_vertical.png';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <img src={logo} alt='Sulkavan pursiseuran logo' className='footer-logo'></img>
        <p className="footer-links"><Link to="/hallitus-ja-toimihenkiloet#top">Yhteystiedot</Link></p>
      </div>
    )
  }
}
