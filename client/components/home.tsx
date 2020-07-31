import React, { createRef } from 'react';
const axios = require('axios').default;
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';
import Explain from './explain';
import Option from '../models/option';
import Contact from '../models/contact';

export default function Home() {
  let emptyContacts: { [id: number] : Contact } = {};
  let signupState = { email: '', password: '', confirm: '' };
  let contactsState = { contacts: emptyContacts,
    newContact: new Contact({ phone: '', name: '' }) };
  let emptyOptions: { [letter: string] : Option } = {};
  let buildState = { opener: '', options: emptyOptions,
    newOption: new Option({ letter: 'A', text: '' }), response: '', showLink: true };

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
    if (buildState.newOption.text.length > 0) {
      buildState.options[buildState.newOption.letter] = buildState.newOption;
    }
    if (contactsState.newContact.phone.length > 0) {
      contactsState.contacts[contactsState.newContact.id] = contactsState.newContact;
    }
    console.log('signupState');
    console.log(signupState);
    console.log('contactsState');
    console.log(contactsState);
    console.log('buildState');
    console.log(buildState);
    axios.post('/account_new', {payload: JSON.stringify(
      {signup: signupState, contacts: contactsState, build: buildState})
    }).then((res) => {
      console.log('res');
      console.log(res);
    })
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
