import React, { useState, useEffect } from 'react';
const axios = require('axios').default;
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';
import Explain from './explain';
import Option from '../models/option';
import Contact from '../models/contact';
import SMSCount from '../models/sms_count';
import {utils} from '../utils';

export default function Home() {
  let emptyAccountData = {status: 'init', account: null};
  const [accountData, setAccountData] = useState(emptyAccountData);
  let emptyInvalid: string[] = [];
  const [invalid, setInvalid] = useState(emptyInvalid);
  const [numContacts, setNumContacts] = useState(0);

  useEffect(() => {
    if (accountData.status != 'init') {
      return;
    }
    try {
      setAccountData({
        status: 'loaded',
        account: JSON.parse(window.localStorage.account)
      });
    }
    catch(err) { setAccountData({ status: 'loaded', account: null }); }
  });

  let emptyContacts: { [id: number] : Contact } = {};
  let signupState = { accountId: utils.randHex(8), phone: '', password: '',
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
    showLink: true,
    smsCount: new SMSCount({question: 1, response: 1, contacts: 1, total: 2})
  };

  function updateSignupState(newState: any) {
    signupState = newState;
  }
  function updateContactsState(newState: any) {
    let newNumContacts = Object.keys(newState.contacts).length;
    if (!utils.isEmpty(newState.newContact.phone)) {
      newNumContacts++;
    }
    setNumContacts(newNumContacts);
    contactsState = newState;
  }
  function updateBuildState(newState: any) {
    buildState = newState;
  }

  function submitSurvey() {
    let newInvalid = checkInvalid();
    setInvalid(newInvalid);
    if (newInvalid.length == 0) {
      signupState.phone = utils.phoneNumberIn(signupState.phone);
      if (buildState.newOption.text.length > 0) {
        buildState.options[buildState.newOption.letter] = buildState.newOption;
      }
      if (contactsState.newContact.phone.length > 0) {
        contactsState.contacts[contactsState.newContact.id] = contactsState.newContact;
      }
      Object.keys(contactsState.contacts).map((contactId) => {
        let contact: Contact = contactsState.contacts[contactId];
        contact.phone = utils.phoneNumberIn(contact.phone);
      });
      axios.post('/api/account_new', {payload: JSON.stringify(
        {signup: signupState, contacts: contactsState, build: buildState})
      }).then((res) => {
        console.log('res');
        console.log(res);
      });
    }
  }

  function checkInvalid() {
    let invalid = [];
    if (utils.isEmpty(signupState.phone)) { invalid.push('phone'); }
    if (signupState.password.length < 8) { invalid.push('password'); }
    if (signupState.confirm != signupState.password) { invalid.push('confirm'); }
    if (Object.keys(contactsState.contacts).length == 0
      && contactsState.newContact.phone.length == 0) {
      invalid.push('no_contacts');
    }
    else {
      if (!utils.phoneNumberIn(contactsState.newContact.phone)) {
        invalid.push('contact_phone|new');
      }
      Object.keys(contactsState.contacts).map((contactId) => {
        let contact = contactsState.contacts[contactId]
        if (!utils.phoneNumberIn(contact.phone)) {
          invalid.push('contact_phone|' + contact.id);
        }
      })
    }
    if (utils.isEmpty(buildState.opener)) { invalid.push('opener'); }
    if (Object.keys(buildState.options).length == 0) { invalid.push('no_options'); }
    Object.keys(buildState.options).map((letter) => {
      if (utils.isEmpty(buildState.options[letter].text)) {
        invalid.push('option|' + letter);
      }
    })
    if (utils.isEmpty(buildState.response)) { invalid.push('response'); }
    return invalid;
  }

  return (
    <form className="body">
      {renderAccountSections()}
      <div className="resp-container">
        <Contacts initState={contactsState} updateParent={updateContactsState}
          invalid={invalid} />
      </div>
      <div className="resp-container">
        <Build initState={buildState} updateParent={updateBuildState}
          invalid={invalid} numContacts={numContacts} />
      </div>
      <div className="resp-container">
        {renderInvalid()}
        <div className="button button-large" onClick={submitSurvey}>
          - Send the survey -
        </div>
      </div>
    </form>
  );

  function renderAccountSections() {
    if (!accountData.account) {
      return (
        <div>
          <div className="resp-container">
            <Explain />
          </div>
          <div className="resp-container">
            <Signup initState={signupState} updateParent={updateSignupState}
              invalid={invalid} />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="resp-container">
          New survey for {utils.phoneNumberOut(accountData.account.phone)}
        </div>
      )
    }
  }

  function renderInvalid() {
    let invalidMessages = {
      'phone': 'Please enter a phone number',
      'password': 'Please enter a password of at least eight characters',
      'confirm': 'Your password and its confirmation do not match',
      'no_contacts': 'Please add at least one contact',
      'contact_phone': 'Please use a ten digit phone number',
      'opener': 'Please add an opening message and question',
      'no_options': 'Please add at least two survey options',
      'option': 'Please add the text for the option',
      'response': 'Please add the automated response to a survey answer'
    }
    if (invalid.length > 0) {
      return (
        <div className="invalid">
          There is missing information in your survey:
          <ul>
            {invalid.map((fieldName) => {
              let trueFieldName = fieldName;
              if (fieldName.includes('|')) {
                trueFieldName = fieldName.split('|')[0];
              }
              return (
                <li key={fieldName}>{invalidMessages[trueFieldName]}</li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  }
}
