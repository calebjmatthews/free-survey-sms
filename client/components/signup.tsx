import React, { useState, useEffect } from 'react';

export default function Signup(props: {initState: {accountId: string, email: string,
  password: string, confirm: string}, updateParent: Function, invalid: string[]}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function changeEmail(ev: any) {
    setEmail(ev.target.value);
  }
  function changePassword(ev: any) {
    setPassword(ev.target.value);
  }
  function changeConfirm(ev: any) {
    setConfirm(ev.target.value);
  }

  useEffect(() => {
    props.updateParent({accountId: props.initState.accountId, email: email,
      password: password, confirm: confirm});
  })

  function renderInvalid(fieldName: string) {
    let invalidMessages = {
      'email': 'Please enter an email address',
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
            <div className="input-label">Email</div>
            <input type="email" value={email} onChange={changeEmail} />
            {renderInvalid('email')}
          </div>
          <div className="input-group">
            <div className="input-label">Password</div>
            <input type="password" value={password} onChange={changePassword} />
            {renderInvalid('password')}
          </div>
          <div className="input-group">
            <div className="input-label">Confirm password</div>
            <input type="password" value={confirm} onChange={changeConfirm} />
            {renderInvalid('confirm')}
          </div>
        </div>
        <div className="resp-row-child">
          You'll use this email and password to see the final results of your survey.
        </div>
      </div>
    </div>
  );
}
