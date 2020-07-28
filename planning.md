Necessary tables:
- accounts: id, email, password, registered_at, last_free_credit
- usage: id, account_id, timestamp, message_count, direction
- surveys: id, account_id, timestamp, opener, response, show_link
- survey_questions: id, account_id, survey_id, letter, text
- survey_contacts: id, account_id, survey_id, contact_id
- messages: id, account_id, survey_id, created_at, updated_at, call_sid, from, to, text
- responses: id, account_id, survey_id, timestamp, letter
- contacts: id, account_id, created_at, updated_at, phone, name
