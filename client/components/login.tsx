import React, { useState, useEffect, SyntheticEvent } from 'react';
const axios = require('axios').default;
import { utils } from '../utils';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  let noErrorMessage: string = null;
  const [errorMessage, setErrorMessage] = useState(noErrorMessage);

  function changePhone(ev: any) {
    let phone = ev.target.value;
    if (ev.target.value.length == 10) {
      phone = utils.phoneNumberOut(phone);
      setPhone(phone);
    }
    else if (ev.target.value.length != 15) {
      setPhone(phone);
    }
  }
  function changePassword(ev: any) {
    setPassword(ev.target.value);
  }

  function toggleRememberMe(ev: any) {
    setRememberMe(!rememberMe);
  }

  function loginSubmit(ev: SyntheticEvent) {
    ev.preventDefault();
    let inPhone = utils.phoneNumberIn(phone);

    axios({
      method: 'POST',
      url: '/login',
      data: {
        username: inPhone,
        password: password,
        remember_me: rememberMe
      },
      credentials: 'same-origin'
    })
    .then((res) => {
      try {
        switch(res.data.message) {
          case('Success'):
          window.localStorage.setItem('account', JSON.stringify(res.data.account));
          let originalPath = location.pathname.slice(7);
          originalPath = originalPath.replace('%2F', '/');
          if (originalPath.length > 1) {
            location.assign('/' + originalPath);
          }
          else {
            location.assign('/');
          }

          setErrorMessage(null);
          break;

          case('Missing credentials'):
          setErrorMessage('Please enter a valid phone number and password.');
          break;

          default:
          setErrorMessage(res.data.message);
        }
      }
      catch(err) {
        setErrorMessage('An unknown error occurred while logging in, please try again later: ' + err);
      }
    })
    .catch((err) => {
      setErrorMessage('An unknown error occurred while logging in, please try again later: ' + err);
    });
  }

  let originalPath = location.pathname.slice(7);
  originalPath = originalPath.replace('%2F', '/');
  if (originalPath.length > 1 && errorMessage == null) {
    setErrorMessage('Please login to access https://textpoll.app/' + originalPath);
  }

  return (
    <div className="body">
      <div className="resp-container">
        <h3>Log in:</h3>
        <form className="login-form" onSubmit={loginSubmit}>
          <div className="input-group">
            <div className="input-label">Phone</div>
            <input type="tel" value={phone} onChange={changePhone}
              autoComplete="tel" />
          </div>
          <div className="input-group">
            <div className="input-label">Password</div>
            <input type="password" value={password} onChange={changePassword}
              autoComplete="password" />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" checked={rememberMe} onChange={toggleRememberMe} />
            <div className="input-label" onClick={toggleRememberMe}>
              Keep me logged in on this device
            </div>
          </div>
          {renderError()}
          <button className="button">Go</button>
        </form>
      </div>
    </div>
  );

  function renderError() {
    if (errorMessage != null) {
      return (<p className="invalid">{errorMessage}</p>)
    }
    return null;
  }
}
