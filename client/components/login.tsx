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

    axios.post('/login', {username: inPhone, password: password, remember_me: rememberMe
    }).then((res) => {
      try {
        switch(res.data.message) {
          case('Success'):
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
      console.log('res');
      console.log(res);
    })
    .catch((err) => {
      setErrorMessage('An unknown error occurred while logging in, please try again later: ' + err);
    });
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
      return (<div className="invalid">{errorMessage}</div>)
    }
    return null;
  }
}
