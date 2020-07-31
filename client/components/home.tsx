import React, { createRef } from 'react';
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';
import Explain from './explain';

export default function Home() {
  let signupState = {};
  let contactsState = {};
  let buildState = {};

  function updateSignupState(newState: any) {
    signupState = newState;
  }
  function updateContactsState(newState: any) {
    contactsState = newState;
  }
  function updateBuildState(newState: any) {
    buildState = newState;
  }

  function submitSurvey() {
    console.log('signupState');
    console.log(signupState);
    console.log('contactsState');
    console.log(contactsState);
    console.log('buildState');
    console.log(buildState);
  }

  return (
    <form className="home">
      <div className="resp-container">
        <Explain />
      </div>
      <div className="resp-container">
        <Signup updateParent={updateSignupState} />
      </div>
      <div className="resp-container">
        <Contacts updateParent={updateContactsState} />
      </div>
      <div className="resp-container">
        <Build updateParent={updateBuildState} />
      </div>
      <div className="resp-container">
        <div className="button button-large" onClick={submitSurvey}>
          - Send the survey -
        </div>
      </div>
    </form>
  );
}
