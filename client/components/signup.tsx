import React, { useState, useEffect } from 'react';
import { utils } from '../utils';

export default function Signup(props: {initState: {accountId: string, phone: string,
  password?: string, confirm?: string}, updateParent: Function, invalid: string[]}) {
  const [phone, setPhone] = useState(props.initState.phone);
  const [password, setPassword] = useState(props.initState.password);
  const [confirm, setConfirm] = useState(props.initState.confirm);

  function changePhone(ev: any) {
    let newPhone = ev.target.value;
    if (ev.target.value.length == 10) {
      newPhone = utils.phoneNumberOut(newPhone);
      setPhone(newPhone);
      props.updateParent({accountId: props.initState.accountId, phone: newPhone,
        password: password, confirm: confirm});
    }
    else if (ev.target.value.length != 15) {
      setPhone(phone);
      props.updateParent({accountId: props.initState.accountId, phone: newPhone,
        password: password, confirm: confirm});
    }
  }
  function changePassword(ev: any) {
    setPassword(ev.target.value);
    props.updateParent({accountId: props.initState.accountId, phone: phone,
      password: ev.target.value, confirm: confirm});
  }
  function changeConfirm(ev: any) {
    setConfirm(ev.target.value);
    props.updateParent({accountId: props.initState.accountId, phone: phone,
      password: password, confirm: ev.target.value});
  }

  // useEffect(() => {
  //   props.updateParent({accountId: props.initState.accountId, phone: phone,
  //     password: password, confirm: confirm});
  // }, [phone, password, confirm])

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
