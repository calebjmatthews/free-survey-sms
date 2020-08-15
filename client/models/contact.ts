import { utils } from '../utils';

export default class Contact {
  id?: string;
  phone: string;
  name: string;
  status?: string;

  constructor(contact: Contact) {
    Object.assign(this, contact);
    if (!this.id) {
      this.id = utils.randHex(8);
    }
    if (!this.status) {
      this.status = 'new';
    }
  }
}
