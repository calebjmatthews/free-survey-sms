import React from 'react';
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';

export default function Home() {
  return (
    <div className="home">
      <div className="resp-container">
        Explanation of features
      </div>
      <div className="resp-container">
        <Signup />
      </div>
      <div className="resp-container">
        <Contacts />
      </div>
      <div className="resp-container">
        <Build />
      </div>
    </div>
  );
}
