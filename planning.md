ssh -i newsummer root@104.131.48.187
scp -i newsummer -r /Users/calebmatthews/free-survey-sms-deploy root@104.131.48.187:/root/

Necessary tables
----------------
- accounts: id, email, password, registered_at, last_free_credit
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
  - New account w/ email and password
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
  - Account (based on email + password)
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
