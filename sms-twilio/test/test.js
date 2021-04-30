const smsNotification = require('./../sms/index');
var assert = require('assert');
let correctParams = {};
let incorrectParams = {};
let context = '';
let status = false;
// Please change the parameters with valid values and parameters to run the test case
correctParams.env = {
  accountSid: 'ACcf19980c1b7d8bbc9816738989fbd1be',
  authToken: '5bd474895c2019134c8b5ebd532cff82'
};
// Please change the parameters with valid values and parameters to run the test case
correctParams.current = {
  to : '+923315572435',
  from : '+14103046211',
  message : 'Hello'
};
//incorrect accountSid and incorrect authToken
incorrectParams.env = {
  accountSid: 'ACcf19980c1b7d8bbc9816738989fbd1be0',
  authToken: '5bd474895c2019134c8b5ebd532cff82'
};
// Please change the parameters with valid values and parameters to run the test case
incorrectParams.current = {
  to : '+923315572435',
  from : '+14103046211',
  message : 'Hello'
};

describe('sms notification with correct params', function () {
  it('sms notification with correct params', function (done) {
    this.timeout(15000);
    setTimeout(done, 15000);
    smsNotification.handler(correctParams, context, function testHandler ( error, res) {
      if ( res && res.status && res.status == 'queued') {
        status = true;
      }
      assert.equal(status, true);
      done();
    });
  })
})
describe('sms notification with incorrect accountSid and authToken', function () {
  it('sms notification with incorrect accountSid and authToken', function (done) {
    smsNotification.handler(incorrectParams, context, function testHandler ( error, res) {
      let status = false;
      if ( error && error.status && error.status == 401) {
        status = true;
      }
      assert.equal(status, true);
      done();
    });
  })
})
