import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Option from '../models/option';
import SMSCount from '../models/sms_count';
import { utils } from '../utils';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let emptyOptions: {[letter: string] : Option} = {};
const URL = 'textpoll.app/r/';

export default function Build(props: {initState: {surveyId: string, opener: string,
  options: {[letter: string] : Option}, newOption: Option, response: string,
  showLink: boolean, smsCount: SMSCount}, updateParent: Function, invalid: string[],
  numContacts: number, balance: number, loggedIn: boolean}) {
  const [opener, setOpener] = useState(props.initState.opener);
  const [options, setOptions] = useState(props.initState.options);
  const [newOption, setNewOption] = useState(props.initState.newOption);
  const [response, setResponse] = useState(props.initState.response);
  const [showLink, setShowLink] = useState(props.initState.showLink);
  const [smsCount, setSMSCount] = useState(props.initState.smsCount);

  function changeOpener(ev: any) {
    setOpener(ev.target.value);
    props.updateParent({opener: ev.target.value});
  }

  function changeOption(option: Option, ev: any) {
    let text = ev.target.value;
    let updOption = options[option.letter];
    updOption.text = text;
    let updOptions = Object.assign({}, options);
    updOptions[option.letter];
    props.updateParent({options: updOptions});
    setOptions(updOptions);
  }

  function changeNewOption(ev: any) {
    let text = ev.target.value;
    let updOption = new Option(newOption);
    updOption.text = text;
    props.updateParent({newOption: updOption});
    setNewOption(updOption);
  }

  useEffect(() => {
    let questionCharCount = opener.length;
    questionCharCount += newOption.text.length;
    Object.keys(options).map((letter) => {
      questionCharCount += options[letter].text.length;
    });
    let responseCharCount = response.length;
    if (showLink) { responseCharCount += (URL.length + 8); }
    setSMSCount(new SMSCount({
      question: Math.ceil(questionCharCount / 160),
      response: Math.ceil(responseCharCount / 160),
      contacts: props.numContacts,
      total: ((Math.ceil(questionCharCount / 160) + Math.ceil(response.length / 160))
        * props.numContacts)
    }))
  }, [opener, options, newOption, response, showLink, props.numContacts]);

  function clearBuild() {
    setOpener('');
    setOptions({});
    let emptyOption = new Option({letter: 'A', text: ''});
    setNewOption(emptyOption);
    setResponse('');
    setShowLink(true);
    let emptySMSCount = new SMSCount({ question: 0, response: 0,
      contacts: props.numContacts, total: 0 });
    setSMSCount(emptySMSCount);
    props.updateParent({ opener: '', options: {}, newOption: emptyOption,
      response: '', showLink: true, smsCount: emptySMSCount });
  }

  function addOption() {
    if (!utils.isEmpty(newOption.text)) {
      let invalidIndex = props.invalid.indexOf('new_option');
      if (invalidIndex != -1) { props.invalid.splice(invalidIndex, 1)};
      let updOptions = options;
      updOptions[newOption.letter] = newOption;
      setOptions(updOptions);
      let highestIndex = 1;
      Object.keys(updOptions).map((letter) => {
        let newIndex = letters.indexOf(letter);
        if (newIndex > highestIndex) { highestIndex = newIndex; }
      });
      let newLetter = letters[highestIndex+1];
      let nextOption = new Option({letter: newLetter, text: ''});
      setNewOption(nextOption);
      props.updateParent({ options: updOptions, newOption: nextOption });
    }
    else {
      let invalidIndex = props.invalid.indexOf('new_option');
      if (invalidIndex == -1) {
        props.invalid.push('new_option');
        let cNewOption = new Option({letter: newOption.letter, text: ''});
        setNewOption(cNewOption);
      };
    }
  }

  function removeOption(remOption: Option) {
    let optionArray: Option[] = [];
    let indexToRemove = null;
    Object.keys(options).map((letter) => {
      let letterIndex = letters.indexOf(letter);
      optionArray[letterIndex] = options[letter];
      if (letter = remOption.letter) { indexToRemove = letterIndex; }
    });
    optionArray.splice(indexToRemove, 1);
    let updOptions: {[letter: string] : Option} = {};
    optionArray.map((option, index) => {
      option.letter = letters[index];
      updOptions[option.letter] = option;
    });
    setOptions(updOptions);
    let nextOption = new Option(newOption);
    nextOption.letter = letters[optionArray.length];
    setNewOption(nextOption);
    props.updateParent({ options: updOptions, newOption: nextOption });
  }

  function clearNewOption() {
    let nextOption = new Option({letter: newOption.letter, text: ''});
    setNewOption(nextOption);
    props.updateParent({ newOption: nextOption });
  }

  function changeResponse(ev: any) {
    setResponse(ev.target.value);
    props.updateParent({ response: ev.target.value });
  }

  function toggleShowLink(ev: any) {
    let newShowLink = !showLink;
    setShowLink(newShowLink);
    props.updateParent({ showLink: newShowLink });
  }

  function renderInvalid(fieldName: string) {
    let invalidMessages = {
      'opener': 'Please add an opening message and question',
      'no_options': 'Please add at least two survey options',
      'option': 'Please add descriptive text for the option',
      'new_option': 'Please add descriptive text for the option',
      'response': 'Please add the automated response to a survey answer'
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
    <div className="build">
      <h3>Build the survey:</h3>
      <div className="resp-row">
        <div className="resp-row-child">
          <div className="button" onClick={clearBuild}>Clear example survey</div>
          <div className="input-group">
            <div className="input-label">Opener</div>
            <textarea rows={3} value={opener} onChange={changeOpener} />
            {renderInvalid('opener')}
          </div>
          {Object.keys(options).map((letter) => {
            let option = options[letter];
            return renderOption(option);
          })}
          <div className="resp-row">
            <div className="input-group resp-row-child">
              <div className="input-label">Option {newOption.letter}</div>
              <textarea rows={1} value={newOption.text}
                onChange={(ev) => changeNewOption(ev)} />
            </div>
            <div className="icon-button text-danger" onClick={clearNewOption}>
              <FontAwesomeIcon icon="trash" />
            </div>
            {renderInvalid('new_option')}
            {renderInvalid('no_options')}
          </div>
          <div className="button" onClick={addOption}>Add option</div>
          <div className="input-group">
            <div className="input-label">Response</div>
            <textarea rows={3} value={response} onChange={changeResponse} />
            {renderInvalid('response')}
          </div>
          <div className="checkbox-group">
            <input type="checkbox" checked={showLink} onChange={toggleShowLink} />
            <div className="input-label" onClick={toggleShowLink}>
              Show link to survey results
            </div>
          </div>
        </div>
        <div className="resp-row-child">
          <h4>Here's what your survey will look like:</h4>
          <div className="survey-demo">
            <div className="demo-message incoming">
              {opener + ' '}
              {Object.keys(options).map((letter) => {
                let option = options[letter];
                return (
                  <span key={letter}>
                    {option.letter + ') ' + option.text + ' '}
                  </span>
                );
              })}
              {renderDemoNewOption()}
            </div>
            <div className="demo-message outgoing">
              A
            </div>
            <div className="demo-message incoming">
              {response + ' '}
              {renderLink(props.initState.surveyId)}
            </div>
          </div>
          {renderUsage()}
        </div>
      </div>
    </div>
  );

  function renderOption(option: Option) {
    return (
      <div className="resp-row" key={option.letter}>
        <div className="input-group resp-row-child">
          <div className="input-label">Option {option.letter}</div>
          <textarea rows={1} value={option.text}
            onChange={(ev) => changeOption(option, ev)} />
          {renderInvalid('option|' + option.letter)}
        </div>
        <div className="icon-button text-danger"
          onClick={() => removeOption(option)}>
          <FontAwesomeIcon icon="trash" />
        </div>
      </div>
    );
  }

  function renderDemoNewOption() {
    if (newOption.text) {
      return <span> {newOption.letter + ') ' + newOption.text} </span>;
    }
    else { return null; }
  }

  function renderLink(surveyId: string) {
    if (showLink) {
      return (<span>{URL + surveyId}</span>);
    }
    return null;
  }

  function renderUsage() {
    let currentExplanation = 'You have 30 free ';
    if (props.loggedIn) {
      currentExplanation = 'You currently have ' + props.balance + ' ';
    }
    return (
      <div className="info-box">
        <div>
          {currentExplanation}
          <FontAwesomeIcon className="text-primary" icon="envelope" />
        </div>
        <div>
          {'This survey will use ' + smsCount.total + ' '}
          <FontAwesomeIcon className="text-primary" icon="envelope" />:
          <ul>
            <li>
              {'Question ' + smsCount.question + ' '}
              <FontAwesomeIcon className="text-primary" icon="envelope" />
            </li>
            <li>
              {'+Response ' + smsCount.response + ' '}
              <FontAwesomeIcon className="text-primary" icon="envelope" />
            </li>
            <li>
              {'x' + smsCount.contacts + ' Contacts'}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
