import { PieChart } from 'react-minimal-pie-chart';
import React from 'react';

export default function Explain() {
  return (
    <div className="explain">
    <h3>How it works:</h3>
      <div className="resp-row">
        <div className="resp-row-child">
          <div className="pseudo-site">
            <div className="pseudo-container">
              <div className="pseudo-title"></div>
              <div className="pseudo-label"></div>
              <div className="pseudo-input"></div>
              <div className="pseudo-label"></div>
              <div className="pseudo-input"></div>
            </div>
            <div className="pseudo-container">
              <div className="pseudo-title"></div>
              <div className="pseudo-label"></div>
              <div className="pseudo-input"></div>
            </div>
          </div>
        </div>
        <div className="resp-row-child">
          <div className="survey-demo">
            <div className="demo-message incoming">
              From Mike Scottsman: What's your preference for this week's meeting? A) Video conference B) Phone call C) Email
            </div>
            <div className="demo-message outgoing">
              B
            </div>
            <div className="demo-message incoming">
            Thanks for your input! Here are the results from the survey so far: https://freesurveysms.io/qr93kl22
            </div>
          </div>
        </div>
        <div className="resp-row-child">
          <PieChart
            style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: '0.6em',
            }}
            data={[
              { title: 'A', value: 10, color: '#aad1f7' },
              { title: 'B', value: 15, color: '#f7dcaa' },
              { title: 'C', value: 20, color: '#d2f7aa' },
            ]}
            label={({ dataEntry }) => `${dataEntry.title} ${Math.round(dataEntry.percentage)}%`}
          />
        </div>
      </div>
      <div className="resp-row">
        <div className="resp-row-child">
          <h4>Create a survey</h4>
          <div>Use this very page to put together a survey in just a few minutes.</div>
        </div>
        <div className="resp-row-child">
          <h4>Texts go out</h4>
          <div>The survey texts will go out to each respondent you've added, and their response will be recorded automatically.</div>
        </div>
        <div className="resp-row-child">
          <h4>Results available at once!</h4>
          <div>As soon as one response has been gathered, the results of the survey are available.</div>
        </div>
      </div>
    </div>
  );
}
