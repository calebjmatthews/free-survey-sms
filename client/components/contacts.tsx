import React, { useState, useEffect } from 'react';
import Contact from '../models/contact';
import { utils } from '../utils';

let emptyContacts: { [id: number] : Contact } = {};
export default function Contacts(props: {initState:
  {contacts: { [id: number] : Contact }, newContact: Contact},
  updateParent: Function, invalid: string[]}) {
  const [contacts, setContacts] = useState(props.initState.contacts);
  function setContactField(value: any, fieldName: string, id: string) {
    let updContact = new Contact(contacts[id]);
    updContact[fieldName] = value;
    let updContacts = Object.assign({}, contacts);
    updContacts[id] = updContact;
    let numContacts = Object.keys(updContacts).length;
    if (!utils.isEmpty(newContact.phone)) {
      numContacts++;
    }
    props.updateParent({contacts: updContacts, numContacts: numContacts});
    setContacts(updContacts);
  }
  const [newContact, setNewContact] = useState(props.initState.newContact);
  function setNewContactField(value: any, fieldName: string) {
    let updContact = new Contact(newContact);
    updContact[fieldName] = value;
    let numContacts = Object.keys(contacts).length;
    if (!utils.isEmpty(newContact.phone)) {
      numContacts++;
    }
    props.updateParent({newContact: updContact, numContacts: numContacts});
    setNewContact(updContact);
  }

  function addContact() {
    setContacts((cts) => {
      let updContacts = cts;
      updContacts[newContact.id] = newContact;
      return updContacts;
    });
    setNewContact((nc) => {
      return new Contact({phone: '', name: ''});
    });
  }

  function changePhone(contact: Contact, ev: any) {
    let phone = ev.target.value;
    if (ev.target.value.length == 10) {
      phone = utils.phoneNumberOut(phone);
      setContactField(phone, 'phone', contact.id);
    }
    else if (ev.target.value.length != 15) {
      setContactField(phone, 'phone', contact.id);
    }
  }

  function changeName(contact: Contact, ev: any) {
    let name = ev.target.value;
    setContactField(name, 'name', contact.id);
  }

  function changeNewPhone(contact: Contact, ev: any) {
    let phone = ev.target.value;
    if (ev.target.value.length == 10) {
      phone = utils.phoneNumberOut(phone);
      setNewContactField(phone, 'phone');
    }
    else if (ev.target.value.length != 15) {
      setNewContactField(phone, 'phone');
    }
  }

  function changeNewName(contact: Contact, ev: any) {
    let name = ev.target.value;
    setNewContactField(name, 'name');
  }

  function renderInvalid(fieldName: string) {
    let invalidMessages = {
      'no_contacts': 'Please add at least one contact',
      'contact_phone': 'Please use a ten digit phone number'
    }
    let trueFieldName = fieldName;
    if (fieldName.includes('|')) {
      trueFieldName = fieldName.split('|')[0];
    }
    if (props.invalid.indexOf(fieldName) != -1) {
      return (<div className="invalid">{invalidMessages[trueFieldName]}</div>);
    }
    return null;
  }

  return (
    <div className="contacts">
      <h3>Add contacts:</h3>
      {Object.keys(contacts).map((id) => {
        let contact = contacts[id];
        return renderContact(contact);
      })}
      <div className="resp-row">
        <div className="input-group resp-row-child">
          <div className="input-label">Phone number</div>
          <input type="tel" value={newContact.phone}
            onChange={(ev) => changeNewPhone(newContact, ev)} />
          {renderInvalid('contact_phone|new')}
        </div>
        <div className="input-group resp-row-child">
          <div className="input-label">Name (optional)</div>
          <input type="text" value={newContact.name}
            onChange={(ev) => changeNewName(newContact, ev)} />
        </div>
      </div>
      <div className="button" onClick={addContact}>Add row</div>
      {renderInvalid('no_contacts')}
    </div>
  );

  function renderContact(contact: Contact) {
    return (
      <div className="resp-row" key={contact.id}>
        <div className="input-group resp-row-child">
          <div className="input-label">Phone number</div>
          <input type="tel" value={contact.phone}
            onChange={(ev) => changePhone(contact, ev)} />
          {renderInvalid('contact_phone|' + contact.id)}
        </div>
        <div className="input-group resp-row-child">
          <div className="input-label">Name (optional)</div>
          <input type="text" value={contact.name}
            onChange={(ev) => changeName(contact, ev)} />
        </div>
      </div>
    );
  }
}
