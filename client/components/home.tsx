import React, { useState, useEffect } from 'react';
const axios = require('axios').default;
import Signup from './signup';
import Contacts from './contacts';
import Build from './build';
import Explain from './explain';
import Option from '../models/option';
import Contact from '../models/contact';
import SMSCount from '../models/sms_count';
import SignupState from '../models/signup_state';
import ContactsState from '../models/contacts_state';
import BuildState from '../models/build_state';
import {utils} from '../utils';

export default function Home() {
  let emptyContacts: { [id: number] : Contact } = {};
  let emptyDelContacts: { [id: number] : Contact } = {};
  let newOptions: { [letter: string] : Option } = {};
  newOptions['A'] = new Option({letter: 'A', text: '10am Sat'});
  newOptions['B'] = new Option({letter: 'B', text: '1pm Sat'});
  newOptions['C'] = new Option({letter: 'C', text: '3pm Sun'});
  let defaultData: {status: string, signupState: SignupState,
    contactsState: ContactsState, buildState: BuildState}
    = {
    status: 'init',
    signupState: new SignupState({
      accountId: utils.randHex(8),
      phone: '',
      password: '',
      confirm: ''
    }),
    contactsState: new ContactsState({
      contacts: emptyContacts,
      deletedContacts: emptyDelContacts,
      newContact: new Contact({ id: utils.randHex(8), phone: '', name: '' }),
      numContacts: 0
    }),
    buildState: new BuildState({
      surveyId: utils.randHex(8),
      opener: ('From Jane Smith: what\'s the best time for the cookout?'),
      options: newOptions,
      newOption: new Option({ letter: 'D', text: '' }),
      response: ('Thanks for your input! Here are the results from the survey so far: '),
      showLink: true,
      smsCount: new SMSCount({question: 1, response: 1, contacts: 1, total: 2})
    })
  };
  const [data, setData] = useState(defaultData);
  let emptyInvalid: string[] = [];
  const [invalid, setInvalid] = useState(emptyInvalid);

  function updateSignupState(changedState: SignupState) {
    setData((oldData) => {
      let newSignupState = oldData.signupState;
      Object.keys(changedState).map((prop) => {
        newSignupState[prop] = changedState[prop];
      });
      return Object.assign({}, oldData, { signupState: newSignupState });
    });
  }
  function updateContactsState(changedState: ContactsState) {
    setData((oldData) => {
      let newContactsState = new ContactsState(oldData.contactsState);
      Object.keys(changedState).map((prop) => {
        newContactsState[prop] = changedState[prop];
      });
      return Object.assign({}, oldData, { contactsState: newContactsState });
    });
  }
  function updateBuildState(changedState: BuildState) {
    setData((oldData) => {
      let newBuildState = new BuildState(oldData.buildState);
      Object.keys(changedState).map((prop) => {
        newBuildState[prop] = changedState[prop];
      });
      return Object.assign({}, oldData, { buildState: newBuildState });
    });
  }

  useEffect(() => {
    if (data.status != 'init') {
      return;
    }
    try {
      let account = JSON.parse(window.localStorage.account);
      axios.get('/api/get_account_existing/' + account.id)
      .then((res) => {
        console.log('res');
        console.log(res);
        let contactMap: { [id: number] : Contact } = {}
        res.data.contacts.map((contact: Contact) => {
          contactMap[contact.id] = new Contact({ id: contact.id,
            phone: utils.phoneNumberOut(contact.phone), name: contact.name,
            status: 'existing' });
        });
        setData((oldData) => {
          return Object.assign({}, oldData, {
            status: 'loadedAccount',
            signupState: new SignupState({ accountId: account.id,
              phone: account.phone }),
            contactsState: new ContactsState({ contacts: contactMap,
              deletedContacts: {},
              newContact: oldData.contactsState.newContact,
              numContacts: Object.keys(contactMap).length })
          })
        });
      });
    }
    catch(err) {
      setData((oldData) => {
        return Object.assign({}, oldData, { status: 'loadedEmpty' });
      })
    }
  });

  function submitSurvey() {
    let newInvalid = checkInvalid();
    setInvalid(newInvalid);
    if (newInvalid.length == 0) {
      console.log('data');
      console.log(data);
      let signup = new SignupState(Object.assign({}, data.signupState));
      let build = new BuildState(Object.assign({}, data.buildState));
      let contacts = new ContactsState(Object.assign({}, data.contactsState));
      signup.phone = utils.phoneNumberIn(signup.phone);
      if (contacts.newContact.phone.length > 0) {
        contacts.contacts[contacts.newContact.id] = contacts.newContact;
      }
      Object.keys(contacts.contacts).map((contactId) => {
        let contact: Contact = contacts.contacts[contactId];
        contact.phone = utils.phoneNumberIn(contact.phone);
      });
      if (build.newOption.text.length > 0) {
        build.options[build.newOption.letter] = build.newOption;
      }
      if (data.status != 'loadedAccount') {
        axios.post('/api/account_new', {payload: JSON.stringify(
          {signup: signup, contacts: contacts, build: build})
        }).then((res) => {
          console.log('res');
          console.log(res);
        });
      }
      else {
        axios.post('/api/account_existing', {payload: JSON.stringify(
          {signup: signup, contacts: contacts, build: build})
        }).then((res) => {
          console.log('res');
          console.log(res);
        });
      }
    }
  }

  function checkInvalid() {
    let invalid = [];
    if (data.status != 'loadedAccount') {
      if (utils.isEmpty(data.signupState.phone)) { invalid.push('phone'); }
      if (data.signupState.password.length < 8) { invalid.push('password'); }
      if (data.signupState.confirm != data.signupState.password) {
        invalid.push('confirm');
      }
    }
    if (Object.keys(data.contactsState.contacts).length == 0
      && data.contactsState.newContact.phone.length == 0) {
      invalid.push('no_contacts');
    }
    else {
      if (data.status != 'loadedAccount'
        && !utils.phoneNumberIn(data.contactsState.newContact.phone)) {
        invalid.push('contact_phone|new');
      }
      Object.keys(data.contactsState.contacts).map((contactId) => {
        let contact = data.contactsState.contacts[contactId]
        if (!utils.phoneNumberIn(contact.phone)) {
          invalid.push('contact_phone|' + contact.id);
        }
      })
    }
    if (utils.isEmpty(data.buildState.opener)) { invalid.push('opener'); }
    if (Object.keys(data.buildState.options).length == 0) {
      invalid.push('no_options');
    }
    Object.keys(data.buildState.options).map((letter) => {
      if (utils.isEmpty(data.buildState.options[letter].text)) {
        invalid.push('option|' + letter);
      }
    })
    if (utils.isEmpty(data.buildState.response)) { invalid.push('response'); }
    return invalid;
  }

  if (data.status == 'init') {
    return (
      <div className="resp-container">Loading...</div>
    );
  }

  return (
    <form className="body">
      {renderAccountSections()}
      <div className="resp-container">
        <Contacts initState={data.contactsState} updateParent={updateContactsState}
          invalid={invalid} />
      </div>
      <div className="resp-container">
        <Build initState={data.buildState} updateParent={updateBuildState}
          invalid={invalid}
          numContacts={data.contactsState.numContacts} />
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
    if (data.status != 'loadedAccount') {
      return (
        <div>
          <div className="resp-container">
            <Explain />
          </div>
          <div className="resp-container">
            <Signup initState={data.signupState} updateParent={updateSignupState}
              invalid={invalid} />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="resp-container">
          New survey for {utils.phoneNumberOut(data.signupState.phone)}
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
