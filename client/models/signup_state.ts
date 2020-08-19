export default class SignupState implements SignupState {
  accountId: string;
  phone: string;
  password?: string;
  confirm?: string;
  balance?: number;

  constructor(signupState: SignupState) {
    Object.assign(this, signupState);
  }
}
