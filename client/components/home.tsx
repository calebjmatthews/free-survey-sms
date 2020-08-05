import React, { createRef } from 'react';
const axios = require('axios').default;
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';
import Explain from './explain';
import Option from '../models/option';
import Contact from '../models/contact';
import {utils} from '../utils';

export default function Home() {
  let emptyContacts: { [id: number] : Contact } = {};
  let signupState = { accountId: utils.randHex(8), email: '', password: '',
    confirm: '' };
  let contactsState = { contacts: emptyContacts,
    newContact: new Contact({ id: utils.randHex(8), phone: '', name: '' }) };
  let newOptions: { [letter: string] : Option } = {};
  newOptions['A'] = new Option({letter: 'A', text: '10am Sat'});
  newOptions['B'] = new Option({letter: 'B', text: '1pm Sat'});
  newOptions['C'] = new Option({letter: 'C', text: '3pm Sun'});
  let buildState = {
    surveyId: utils.randHex(8),
    opener: ('From Jane Smith: what\'s the best time for the cookout?'),
    options: newOptions,
    newOption: new Option({ letter: 'D', text: '' }),
    response: ('Thanks for your input! Here are the results from the survey so far: '),
    showLink: true
  };

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
    axios.post('/api/account_new', {payload: JSON.stringify(
      {signup: signupState, contacts: contactsState, build: buildState})
    }).then((res) => {
      console.log('res');
      console.log(res);
    })
  }

  return (
    <form className="body">
      <div className="resp-container">
        <Explain />
      </div>
      <div className="resp-container">
        <Signup initState={signupState} updateParent={updateSignupState} />
      </div>
      <div className="resp-container">
        <Contacts initState={contactsState} updateParent={updateContactsState} />
      </div>
      <div className="resp-container">
        <Build initState={buildState} updateParent={updateBuildState} />
      </div>
      <div className="resp-container">
        <div className="button button-large" onClick={submitSurvey}>
          - Send the survey -
        </div>
      </div>
    </form>
  );
}
