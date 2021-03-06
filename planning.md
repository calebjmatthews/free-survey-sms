ssh -i newsummer cmatthews@104.131.48.187
scp -i newsummer -r /Users/calebmatthews/free-survey-sms-deploy cmatthews@104.131.48.187:/home/cmatthews/

Necessary tables
----------------
- accounts: id, phone, password, registered_at, last_free_credit
- usage: id, account_id, timestamp, message_count, direction
- surveys: id, account_id, active, timestamp, opener, response, show_link
- survey_options: id, account_id, survey_id, letter, text
- survey_contacts: id, account_id, survey_id, active, contact_id
- messages: id, account_id, survey_id, timestamp, call_sid, status, from, to, text
- responses: id, account_id, survey_id, timestamp, letter
- contacts: id, account_id, created_at, updated_at, phone, name

Page submission for new account
-------------------------------
- Send from client side:
  - New account w/ phone number and password
  - Calculate usage, forbid surveys which exceed 30 total messages = (#messages in question + #)
  - New survey with generated id
  - Survey option set with survey id
  - All contacts with account id
  - Contacts to be used for this survey with account id and survey id

- Receiving on client side:
  - Insert account, usage, survey, survey options, survey contacts, and contacts
  - Send survey sms to each survey contact
  - Insert message in messages table, record Twilio call_sid and status

Receiving response sms
----------------------
- Search for sender's phone number in active survey numbers
- Match survey from survey contact, pull survey id and account id
  - If valid response sms, send sms with survey's response
  - If invalid response sms, send sms with explanation of expectation
- Insert message in messages table, record Twilio call_sid and status
- Insert response in responses table

Viewing results page
--------------------
- Page url includes survey id
- Pull survey, survey options, responses
- Create graph with result %s and option letters (A, B, C, ...), with legend and table of results at bottom of page
- Ability to export results as csv

New survey for existing account
-------------------------------
- Pull for page load:
  - Account (based on phone + password)
  - Usage so far, showing remaining free messages
  - Existing contacts, filling out contacts list with status "existing"
- Send from client side:
  - Calculate usage, forbid surveys which exceed 30 total messages
  - New survey with generated id
  - Survey option set with survey id
  - Insert, update, or delete statuses for contacts as necessary
  - Contacts to be used for this survey with account id and survey id

- Receiving on client side:
  - Insert usage, survey, survey options, survey contacts, and perform contact changes
  - Send survey sms to each survey contact
  - Insert message in messages table, record Twilio call_sid and status

Login
-----
- Enter phone number and password
  - User info stored in local storage
- If password is forgotten:
  - Enter phone number
  - Send password recovery text to phone number
  - Code is entered to login
  - Mandatory password change
- After logged in, "Login" changes to "Account"

Account
-------
- Historical surveys
- Add/edit/remove contacts
- Add funds

Updating parent state
---------------------
- On change to child input field
  - Update parent with object containing field that has changed
  - Parent rebuilds state, only applying child change to field that has changed
  - Parent calls setState function to update the component state

Payments
--------
- Twilio cost per message is $0.75 cents per 100 messages
- Two potential models:
  - $2 for 100 messages, $5 for 400 messages, $10 for 1000 messages
  - $2 for 50 contacts, $5 for 200 contacts, $10 for 500 contacts
