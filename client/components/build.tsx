import React, { useState, useEffect } from 'react';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let highestLetter = 0;
let emptyQuestions: {[letter: string] : Question} = {};
const url = 'https://freesurveysms.io/';
const link = 'qr93kl22';

export default function Build() {
  const [opener, setOpener] = useState('From Jane Smith: what\'s the best time for '
    + 'the cookout?');
  const [questions, setQuestions] = useState(emptyQuestions);
  const [newQuestion, setNewQuestion] = useState(new Question({letter: 'A', text: ''}));
  const [response, setResponse] = useState('Thanks for your input! Here are the '
    +  'results from the survey so far: ');
  const [showLink, setShowLink] = useState(true);

  function changeOpener(ev: any) {
    setOpener(ev.target.value);
  }

  function changeQuestion(question: Question, ev: any) {
    let text = ev.target.value;
    setQuestions((qs) => {
      let updQuestion = qs[question.letter];
      updQuestion.text = text;
      let updQuestions = Object.assign({}, qs);
      updQuestions[question.letter];
      return updQuestions;
    });
  }

  function changeNewQuestion(ev: any) {
    let text = ev.target.value;
    setNewQuestion((nq) => {
      let updQuestion = new Question(nq);
      updQuestion.text = text;
      return updQuestion;
    })
  }

  function addQuestion() {
    setQuestions((qs) => {
      let updQuestions = qs;
      updQuestions[newQuestion.letter] = newQuestion;
      return updQuestions;
    });
    setNewQuestion((nq) => {
      let newLetter = letters[highestLetter+1];
      highestLetter++;
      return new Question({letter: newLetter, text: ''});
    });
  }

  function changeResponse(ev: any) {
    setResponse(ev.target.value);
  }

  function toggleShowLink(ev: any) {
    setShowLink(!showLink)
  }

  return (
    <div className="build">
      <h3>Build the survey:</h3>
      <div className="resp-row">
        <div className="resp-row-child">
          <div className="input-group">
            <div className="input-label">Opener</div>
            <textarea rows={3} value={opener} onChange={changeOpener} />
          </div>
          {Object.keys(questions).map((letter) => {
            let question = questions[letter];
            return renderQuestion(question);
          })}
          <div className="input-group" key={newQuestion.letter}>
            <div className="input-label">Question {newQuestion.letter}</div>
            <textarea rows={1} value={newQuestion.text}
              onChange={(ev) => changeNewQuestion(ev)} />
          </div>
          <div className="button" onClick={addQuestion}>Add question</div>
          <div className="input-group">
            <div className="input-label">Response</div>
            <textarea rows={3} value={response} onChange={changeResponse} />
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
              {Object.keys(questions).map((letter) => {
                let question = questions[letter];
                return (
                  <span id={letter}>
                    {question.letter + ') ' + question.text + ' '}
                  </span>
                );
              })}
              <span>
                {newQuestion.letter + ') ' + newQuestion.text}
              </span>
            </div>
            <div className="demo-message outgoing">
              A
            </div>
            <div className="demo-message incoming">
              {response + ' '}
              {renderLink()}
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  function renderQuestion(question: Question) {
    return (
      <div className="input-group" key={question.letter}>
        <div className="input-label">Question {question.letter}</div>
        <textarea rows={1} value={question.text}
          onChange={(ev) => changeQuestion(question, ev)} />
      </div>
    );
  }

  function renderLink() {
    if (showLink) {
      return (<span>{url + link}</span>);
    }
    return null;
  }
}

class Question {
  letter: string;
  text: string;
  constructor(question: Question) {
    Object.assign(this, question);
  }
}
