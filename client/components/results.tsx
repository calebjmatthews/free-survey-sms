import React, { useState, useEffect } from 'react';
const axios = require('axios').default;
import { PieChart } from 'react-minimal-pie-chart';

const chartColors = ['#aad1f7', '#f7dcaa', '#d2f7aa', '#cac2f7', '#f7aabc', '#f0fbb7'];
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default function Results() {
  let initData: any = {status: 'init'};
  const [data, setData] = useState(initData);

  useEffect(() => {
    if (data.status != 'init') {
      return;
    }
    let surveyId = window.location.pathname.slice(3);
    axios.get('/api/survey_results/' + surveyId)
    .then((res) => {
      if (res.data) {
        let newData: any = res.data;
        newData.surveyOptions.map((option) => {
          option.count = 0;
        });
        newData.responses.map((response) => {
          newData.surveyOptions[letters.indexOf(response.letter)].count++;
        });
        newData.status = 'finished';
        setData(newData);
      }
      else {
        setData({status: 'missing'});
      }
    })
    .catch((err) => {
      console.log('err');
      console.log(err);
    });
  });

  if (data.status == 'finished') {
    return (
      <div className="body">
        <div className="resp-container">
          <h3>Survey Results:</h3>
          <div className="resp-row">
            <div className="resp-row-child">
              <PieChart
                style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: '0.6em',
                }}
                data={getPieData()}
                animate
                label={({ dataEntry }) => `${dataEntry.title} ${Math.round(dataEntry.percentage)}%`}
              />
            </div>
            {renderTable()}
          </div>
        </div>
      </div>
    );
  }
  else if (data.status == 'init') {
    return (
      <div className="body">
        <div className="resp-container">
          <h3>Survey Results:</h3>
          <div>Loading...</div>
        </div>
      </div>
    );
  }
  else {
    return null;
  }

  function getPieData() {
    let pieData = [];
    data.surveyOptions.map((option, index) => {
      if (option.count > 0) {
        pieData.push({
          title: option.letter,
          value: option.count,
          color: chartColors[(index) % 6]
        })
      }
    });
    return pieData;
  }

  function renderTable() {
    return (
      <div className="resp-row-child">
        <h4>{data.survey.opener}</h4>
        <table>
          <thead>
            <tr>
              <th>Letter</th>
              <th>Option</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {data.surveyOptions.map((option, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="color-square"
                      style={{'background': chartColors[(index) % 6]}}></div>
                    {option.letter}
                  </td>
                  <td>{option.text}</td>
                  <td>{option.count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
