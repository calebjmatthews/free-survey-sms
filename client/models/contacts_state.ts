import Contact from './contact';

export default class ContactsState {
  contacts: { [id: number] : Contact };
  deletedContacts: { [id: number] : Contact };
  newContact: Contact;
  numContacts: number;

  constructor(contactsState: ContactsState) {
    Object.assign(this, contactsState);
  }
}
