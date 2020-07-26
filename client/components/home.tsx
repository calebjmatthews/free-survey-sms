import React from 'react';
import Signup from './signup';

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
        <div>
          Add contacts (limit of 30 for now)
        </div>
        <hr />
        <div>
          Construct SMS survey: suggested opening, 2 - 6 question options, suggested auto-response with results, Send!
        </div>
      </div>
    </div>
  );
}
