export default class SMSCount {
  question: number;
  response: number;
  contacts: number;
  total: number;

  constructor(smsCount: SMSCount) {
    Object.assign(this, smsCount);
  }
}
