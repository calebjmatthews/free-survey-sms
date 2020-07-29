import React from 'react';
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';
import Explain from './explain';

export default function Home() {
  return (
    <form className="home">
      <div className="resp-container">
        <Explain />
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
    </form>
  );
}
