import React, { useState, useEffect } from 'react';

export default function Signup() {
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

  return (
    <div className="signup">
      <h3>Quick sign-up:</h3>
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
  );
}
