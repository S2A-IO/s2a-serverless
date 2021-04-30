'use strict';

/**
 * @author Copyright RIKSOF (Private) Limited.
 */
const Twilio = require( 'twilio' );
const env = process.env;

const BAD_REQUEST = 400;

/**
 * This function is the entry point for serverless function.
 *
 * @param {any} data                          Data passed to this function.
 * @param {any} context                       Client context. Unused.
 * @param {function} callback                 Callback function to pass back
 *                                            the response.
 *
 * @returns {undefined} None.
 */
module.exports.handler = function SendSMSHandler( data, context, callback ) {
  let client = new Twilio(
    env.accountSid ? env.accountSid : data.env.accountSid,
    env.authToken ? env.authToken : data.env.authToken
  );

  let p = [];

  if ( Array.isArray( data.current ) ) {
    for ( let i = 0; i < data.current.length; i++ ) {
      p[ i ] = sendSMS( client, data.current[ i ] );
      p = Promise.all( p );
    }
  } else {
    p = sendSMS( client, data.current );
  }

  return p.then( function AfterSMSSent( message ) {
    callback( null, message );
  }).catch( function OnSMSError( error ) {
    callback( error, null );
  });
};

function sendSMS( client, current ) {
  // Initialize error as empty.
  let error = null;

  // Validate the param from constains value.
  if ( !current.from ) error = new Error('Please provide the sending phone number');

  // Validate the param to constains value.
  if ( !current.to ) error = new Error('Please provide the recipient phone numbers');

  // Validate the param message constains value.
  if ( !current.message ) error = new Error('Please provide a message for SMS');

  // Throw Validation error if exist.
  if ( error ) {
    error.status = TwilioConstructor.BAD_REQUEST;
    return Promise.reject( error );
  }

  return client.messages.create({
    to: current.to,
    from: current.from,
    body: current.message
  });
}
