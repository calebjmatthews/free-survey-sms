import React, { useState, useEffect } from 'react';
const axios = require('axios').default;
import { utils } from '../utils';

export default function MessageResults() {
  let initData: any = {status: 'init'};
  const [data, setData] = useState(initData);

  useEffect(() => {
    if (data.status != 'init') {
      return;
    }
    let surveyId = window.location.pathname.slice(10);
    axios.get('/api/message_results/' + surveyId)
    .then((res) => {
      if (res.data) {
        let newData: any = res.data;
        newData.messageMap = {};
        newData.messages.map((message) => {
          if (message.direction == 'outgoing') {
            newData.messageMap[message.contact_id] = message;
          }
        });
        newData.responseMap = {};
        // Responses are sorted with newest responses first, so that this mapping
        //  function will store the oldest reponse. Responses after the initial
        //  response are ignored.
        newData.responses.map((response) => {
          newData.responseMap[response.contact_id] = response;
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
      if (err.response.status == 403) {
        location.assign('/login/' + encodeURIComponent(location.pathname.slice(1)));
      }
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
              let message = data.messageMap[contact.id];
              let response = data.responseMap[contact.id];
              let status = 'missing';
              if (message) { status = message.status; }
              let timestamp = null;
              if (response) {
                status = 'responded';
                let tDate = new Date(response.timestamp);
                timestamp = utils.getDateString(tDate) + ' '
                  + utils.getTimeString(tDate);
              }
              return (
                <tr key={index}>
                  <td>{utils.phoneNumberOut(contact.phone)}</td>
                  <td>{contact.name}</td>
                  <td>{(message) ? utils.upperCaseFirst(status) : ''}</td>
                  <td>{(timestamp) ? timestamp : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
