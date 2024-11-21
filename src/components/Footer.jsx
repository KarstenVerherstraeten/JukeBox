import { React } from 'react';
import { Link } from 'react-router-dom';
import style from '../modules/footer.module.css';
import logo from '../assets/images/Spotify.svg'

const Footer = () => {
    return (
       <>
       <div className={style.footer}>
       <p>Powered by</p> <a href="https://www.spotify.com"><img src={logo} alt="" /></a>
       </div>
       
       
       </>
    );
}

export default Footer;