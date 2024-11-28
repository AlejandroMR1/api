import React from 'react'
import "./Footer.css"

const Footer = () => {
    return (
        <footer className='footer'>
            <h1>Effitrack</h1>
            <br />
            <h1>©Copyright:</h1>
            <h1>Todos los derechos reservados</h1>
            <br />
            <div className='social-media'>
                <a href="https://www.twitter.com">
                <img src="X.jpg" alt='X'></img>
                </a>
                <a href="https://www.instagram.com">
                <img src="Instagram.jpg" alt='Instagram'></img>
                </a>
                <a href="https://www.facebook.com">
                <img src="Facebook.jpg" alt='Facebook'></img>
                </a>
            </div>
        </footer>
    )
}

export default Footer