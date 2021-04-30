# twilio-sms
Twilio SMS Sender for S2A
- [Installation](#installation)
- [Usage Example](#usage-example)

## Installation
  ```
npm install git://github.com/S2A-IO/twilio-sms --save
  ```
twilio-sms has the peerDependencies of twilio we have to install it.
```
npm install twilio@3.18.0 --save
```
## Usage Example
```
// Please change the parameters with valid values and parameters to run the case
data.env = {
  accountSid: 'ACcf19980c1b7d8bbc9816738989fbd1be',
  authToken: '5bd474895c2019134c8b5ebd532cff82'
};
// Please change the parameters with valid values and parameters to run the case
data.current = {
  to : '+923315572435',
  from : '+14103046211',
  message : 'Hello'
};
```

| Field    | Description      | Required       |
|----------|-------------|----------------|
| data   | Data passed to this function.  | **YES** |
| context      | Client context. Unused. | **YES** |
| callback      | Callback function to pass back the response. | **YES** |
  ```
const smsNotification = require('./../server/index');

smsNotification.handler(data, context, function testHandler ( error, res) {
  if ( error ) {
    console.log('error',error);
  } else {
    console.log('res',res);
  }
});
  ```
