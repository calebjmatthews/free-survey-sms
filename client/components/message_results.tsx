import React, { useState, useEffect } from 'react';
const axios = require('axios').default;

export default function MessageResults() {
  let initData: any = {status: 'init'};
  const [data, setData] = useState(initData);

  useEffect(() => {
    if (data.status != 'init') {
      return;
    }
    let surveyId = window.location.pathname.slice(10);
    console.log('surveyId');
    console.log(surveyId);
    axios.get('/api/message_results/' + surveyId)
    .then((res) => {
      if (res.data) {
        console.log('res.data');
        console.log(res.data);
        let newData: any = res.data;
        newData.messageMap = {};
        newData.messages.map((message) => {

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
          <h3>Messaging Results:</h3>
          {renderTable()}
        </div>
      </div>
    );
  }
  else if (data.status == 'init') {
    return (
      <div className="body">
        <div className="resp-container">
          <h3>Messaging Results:</h3>
          <div>Loading...</div>
        </div>
      </div>
    );
  }
  else {
    return null;
  }

  function renderTable() {
    return (
      <div className="resp-row-child">
        <h4>{data.survey.opener}</h4>
        <table>
          <thead>
            <tr>
              <th>Phone</th>
              <th>Name</th>
              <th>Status</th>
              <th>Response on</th>
            </tr>
          </thead>
          <tbody>
            {data.contacts.map((contact, index) => {
              return (
                <tr key={index}>
                  <td>{contact.phone}</td>
                  <td>{contact.name}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
