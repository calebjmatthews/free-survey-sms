import React from 'react';
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';

export default function Home() {
  return (
    <div className="home">
      <div className="resp-container">
        <div>
          Explanation of features
        </div>
        <hr />
        <Signup />
        <hr />
        <Contacts />
        <hr />
        <Build />
      </div>
    </div>
  );
}
