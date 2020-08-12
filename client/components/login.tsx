import React, { useState, useEffect, SyntheticEvent } from 'react';
const axios = require('axios').default;
import { utils } from '../utils';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

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

  function loginSubmit(ev: SyntheticEvent) {
    ev.preventDefault();
    let inPhone = utils.phoneNumberIn(phone);

    axios.post('/login', {username: inPhone, password: password
    }).then((res) => {
      console.log('res');
      console.log(res);
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
          <button className="button">Go</button>
        </form>
      </div>
    </div>
  );
}
