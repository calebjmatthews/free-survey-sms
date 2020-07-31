export default class Option {
  letter: string;
  text: string;
  constructor(option: Option) {
    Object.assign(this, option);
  }
}
