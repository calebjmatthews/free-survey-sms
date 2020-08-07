import React, { useState, useEffect } from 'react';
import HeaderSection from './header_section';

const logo = require('../images/textpoll.png');

export default function Header() {
  function headerClick(name: string) {
    let relativeUrl = '';
    if (name != 'home') {
      relativeUrl = name.toLowerCase();
    }
    location.assign('/' + relativeUrl);
  }

  return (
    <div className="header">
      <div className='header-section' onClick={() => {headerClick('home')}}>
        <div className="logo-container">
          <img src={logo.default} />
          <div className="logo-words">
            <div className="logo-word-one">Text</div>
            <div className="logo-word-two">Poll</div>
          </div>
        </div>
      </div>
      <div className='header-section' onClick={() => {headerClick('login')}}>
        Login
      </div>
    </div>
  );
}
