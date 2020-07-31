import React, { useState, useEffect } from 'react';

export default function Signup(props: {updateParent: Function}) {
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
    props.updateParent({email: email, password: password, confirm: confirm});
  })

  return (
    <div className="signup">
      <h3>Quick sign-up:</h3>
      <div className="resp-row">
        <div className="resp-row-child">
          <div className="input-group">
            <div className="input-label">Email</div>
            <input type="email" value={email} onChange={changeEmail} />
          </div>
          <div className="input-group">
            <div className="input-label">Password</div>
            <input type="password" value={password} onChange={changePassword} />
          </div>
          <div className="input-group">
            <div className="input-label">Confirm password</div>
            <input type="password" value={confirm} onChange={changeConfirm} />
          </div>
        </div>
        <div className="resp-row-child">
          You'll use this email and password to see the final results of your survey.
        </div>
      </div>
    </div>
  );
}
