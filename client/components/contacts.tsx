import React, { useState, useEffect } from 'react';
import { utils } from '../utils';

let emptyContacts: { [id: number] : Contact } = {};
export default function Signup() {
  const [contacts, setContacts] = useState(emptyContacts);
  function setContactField(value: any, fieldName: string, id: number) {
    setContacts((cts) => {
      let updContact = new Contact(cts[id]);
      updContact[fieldName] = value;
      let updContacts = Object.assign({}, cts);
      updContacts[id] = updContact;
      return updContacts;
    });
  }
  const [newContact, setNewContact] = useState(new Contact({phone: '', name: ''}));
  function setNewContactField(value: any, fieldName: string) {
    setNewContact((nc) => {
      let updContact = new Contact(nc);
      updContact[fieldName] = value;
      return updContact;
    });
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
    setContactField(phone, 'phone', contact.id);
  }

  function changeName(contact: Contact, ev: any) {
    let name = ev.target.value;
    setContactField(name, 'name', contact.id);
  }

  function changeNewPhone(contact: Contact, ev: any) {
    let phone = ev.target.value;
    setNewContactField(phone, 'phone');
  }

  function changeNewName(contact: Contact, ev: any) {
    let name = ev.target.value;
    setNewContactField(name, 'name');
  }

  return (
    <div className="contacts">
      <h3>Add contacts:</h3>
      {Object.keys(contacts).map((id) => {
        let contact = contacts[id];
        return renderContact(contact);
      })}
      <div className="row">
        <div className="input-group">
          <div className="input-label">Phone number</div>
          <input type="tel" value={newContact.phone}
            onChange={(ev) => changeNewPhone(newContact, ev)} />
        </div>
        <div className="input-group">
          <div className="input-label">Name (optional)</div>
          <input type="text" value={newContact.name}
            onChange={(ev) => changeNewName(newContact, ev)} />
        </div>
      </div>
      <div className="button" onClick={addContact}>Add row</div>
    </div>
  );

  function renderContact(contact: Contact) {
    return (
      <div className="row" key={contact.id}>
        <div className="input-group">
          <div className="input-label">Phone number</div>
          <input type="tel" value={contact.phone}
            onChange={(ev) => changePhone(contact, ev)} />
        </div>
        <div className="input-group">
          <div className="input-label">Name (optional)</div>
          <input type="text" value={contact.name}
            onChange={(ev) => changeName(contact, ev)} />
        </div>
      </div>
    );
  }
}

class Contact {
  id?: number;
  phone: string;
  name: string;
  status?: string;

  constructor(contact: Contact) {
    Object.assign(this, contact);
    if (!this.id) {
      this.id = Math.floor(utils.rand() * 1000000000000);
    }
    if (!this.status) {
      this.status = 'clean';
    }
  }
}
