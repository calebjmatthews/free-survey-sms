import React, { useState, useEffect } from 'react';
import { utils } from '../utils';

export default function Signup(props: {initState: {accountId: string, phone: string,
  password: string, confirm: string}, updateParent: Function, invalid: string[]}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

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
  function changeConfirm(ev: any) {
    setConfirm(ev.target.value);
  }

  useEffect(() => {
    props.updateParent({accountId: props.initState.accountId, phone: phone,
      password: password, confirm: confirm});
  })

  function renderInvalid(fieldName: string) {
    let invalidMessages = {
      'phone': 'Please enter a phone number',
      'password': 'Please enter a password of at least eight characters',
      'confirm': 'Your password and its confirmation do not match'
    }
    if (props.invalid.indexOf(fieldName) != -1) {
      return (<div className="invalid">{invalidMessages[fieldName]}</div>);
    }
    return null;
  }

  return (
    <div className="signup">
      <h3>Quick sign-up:</h3>
      <div className="resp-row">
        <div className="resp-row-child">
          <div className="input-group">
            <div className="input-label">Phone</div>
            <input type="tel" value={phone} onChange={changePhone}
              autoComplete="tel" />
            {renderInvalid('phone')}
          </div>
          <div className="input-group">
            <div className="input-label">Password</div>
            <input type="password" value={password} onChange={changePassword}
              autoComplete="new-password" />
            {renderInvalid('password')}
          </div>
          <div className="input-group">
            <div className="input-label">Confirm password</div>
            <input type="password" value={confirm} onChange={changeConfirm}
              autoComplete="new-password" />
            {renderInvalid('confirm')}
          </div>
        </div>
        <div className="resp-row-child">
          <div className="info-box">
            You'll use this phone number and password to see the final results of your survey.
          </div>
        </div>
      </div>
    </div>
  );
}
