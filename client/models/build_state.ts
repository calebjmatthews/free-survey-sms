import {utils} from '../utils';
import Option from './option';
import SMSCount from './sms_count';

export default class BuildState {
  surveyId: string;
  opener: string;
  options: { [letter: string] : Option };
  newOption: Option;
  response: string;
  showLink: boolean;
  smsCount: SMSCount;

  constructor(buildState: BuildState) {
    Object.assign(this, buildState);
  }
}
