import React, { useState, useEffect } from 'react';
import Option from '../models/option';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let highestLetter = 0;
let emptyOptions: {[letter: string] : Option} = {};
const URL = 'textpoll.app/r/';

export default function Build(props: {initState: {surveyId: string, opener: string,
  options: {[letter: string] : Option}, newOption: Option, response: string,
  showLink: boolean}, updateParent: Function, invalid: string[]}) {
  const [opener, setOpener] = useState(props.initState.opener);
  const [options, setOptions] = useState(props.initState.options);
  const [newOption, setNewOption] = useState(props.initState.newOption);
  const [response, setResponse] = useState(props.initState.response);
  const [showLink, setShowLink] = useState(props.initState.showLink);

  function changeOpener(ev: any) {
    setOpener(ev.target.value);
  }

  function changeOption(option: Option, ev: any) {
    let text = ev.target.value;
    setOptions((os) => {
      let updOption = os[option.letter];
      updOption.text = text;
      let updOptions = Object.assign({}, os);
      updOptions[option.letter];
      return updOptions;
    });
  }

  function changeNewOption(ev: any) {
    let text = ev.target.value;
    setNewOption((no) => {
      let updOption = new Option(no);
      updOption.text = text;
      return updOption;
    })
  }

  useEffect(() => {
    props.updateParent({surveyId: props.initState.surveyId, opener: opener,
      options: options, newOption: newOption, response: response, showLink: showLink});
  })

  function clearBuild() {
    setOpener('');
    setNewOption(new Option({letter: 'A', text: ''}));
    setOptions({});
    setResponse('');
    setShowLink(true);
  }

  function addOption() {
    setOptions((os) => {
      let updOptions = os;
      updOptions[newOption.letter] = newOption;
      return updOptions;
    });
    setNewOption((no) => {
      let newLetter = letters[highestLetter+1];
      highestLetter++;
      return new Option({letter: newLetter, text: ''});
    });
  }

  function changeResponse(ev: any) {
    setResponse(ev.target.value);
  }

  function toggleShowLink(ev: any) {
    setShowLink(!showLink)
  }

  function renderInvalid(fieldName: string) {
    let invalidMessages = {
      'opener': 'Please add an opening message and question',
      'no_options': 'Please add at least two survey options',
      'option': 'Please add the text for the option',
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
          <div className="input-group" key={newOption.letter}>
            <div className="input-label">Option {newOption.letter}</div>
            <textarea rows={1} value={newOption.text}
              onChange={(ev) => changeNewOption(ev)} />
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
              <span>
                {newOption.letter + ') ' + newOption.text}
              </span>
            </div>
            <div className="demo-message outgoing">
              A
            </div>
            <div className="demo-message incoming">
              {response + ' '}
              {renderLink(props.initState.surveyId)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderOption(option: Option) {
    return (
      <div className="input-group" key={option.letter}>
        <div className="input-label">Option {option.letter}</div>
        <textarea rows={1} value={option.text}
          onChange={(ev) => changeOption(option, ev)} />
        {renderInvalid('option|' + option.letter)}
      </div>
    );
  }

  function renderLink(surveyId: string) {
    if (showLink) {
      return (<span>{URL + surveyId}</span>);
    }
    return null;
  }
}
