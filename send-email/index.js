'use strict';

/**
 * @author Copyright RIKSOF (Private) Limited.
 */
const nodemailer = require( 'nodemailer' );
const aws = require( '@aws-sdk/client-ses' );

// Constants.
const API_VERSION = '2010-12-01';
const BAD_GATEWAY = 502;
const BAD_REQUEST = 400;
const ERR_INVALID_FROM = 'A valid from address was not provided';
const ERR_INVALID_TO = 'Please provide a to address for the email';
const ERR_INVALID_SUBJECT = 'Please provide a subject for the email';
const ERR_INVALID_MESSAGE = 'Please provide a message for the email';

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
module.exports.handler = function SendEmailHandler( data, context, callback ) {
  // Setup the credentials to use for this request.
  process.env.AWS_ACCESS_KEY_ID = data.env.user;
  process.env.AWS_SECRET_ACCESS_KEY = data.env.pass;

  // Setup SES
  const ses = new aws.SES({
    apiVersion: API_VERSION,
    region: data.env.host
  });

  // Create Nodemailer SES transporter
  const transporter = nodemailer.createTransport({
    SES: { ses, aws },
  });

  let p = [];
  if ( Array.isArray( data.current ) ) {
    for ( let i = 0; i < data.current.length; i++ ) {
      p[i] = sendEmail( transporter, data.current[ i ] );
    }
    p = Promise.all(p);
  } else {
    p = sendEmail( transporter, data.current );
  }
  return p.then(function AfterEmailSent( res ) {
    console.log( 'Email successfully', res );
    callback( null, res );
  }).catch(function OnEmailError( error ) {
    console.log( 'Email error', error );
    callback( error, null );
  });
};

/**
 * This function actually sends the email.
 *
 * @param {any} transporter               Nodemailer transporter to use for
 *                                        sending of email.
 * @param {any} current                   Current document that contains information
 *                                        on the email to be sent.
 *
 * @returns {Promise<any>} info           Info on email sent.
 */
function sendEmail( transporter, current ) {
  return new Promise(function OnSendEmailPromise( resolve, reject ) {
    let error = null;

    // Make sure the required fields have been provided.
    if ( current.from == null ) error = new Error( ERR_INVALID_FROM );
    else if ( current.to == null ) error = new Error( ERR_INVALID_TO );
    else if ( current.subject == null ) error = new Error( ERR_INVALID_SUBJECT );
    else if ( current.message == null ) error = new Error( ERR_INVALID_MESSAGE );

    // Throw Validation error if an error occurred in one of the cases above.
    if ( error != null ) {
      error.status = BAD_REQUEST;
      reject(error);
    }

    // We are here implies, request is valid and we can initialize params with
    // mandatory information.
    const params = {
      from: current.from,
      to: current.to,
      subject: current.subject
    };

    // Set message based on whether we are send html or normal text email.
    if ( current.isHtml ) params.html = current.message;
    else params.text = current.message;

    // Set optional values as provided.
    if ( current.cc != null ) params.cc = current.cc;
    if ( current.bcc != null ) params.bcc = current.bcc;
    if ( current.attachments != null && current.attachments.length > 0 ) params.attachments = current.attachments;
    if ( current.replyTo != null ) params.replyTo = current.replyTo;
    if ( current.inReplyTo != null ) params.inReplyTo = current.inReplyTo;
    if ( current.priority != null ) params.priority = current.priority;

    // Finally send the email.
    transporter.sendMail( params, function SendMail( error, info ) {
      if ( error ) {
        // If we encountered an error, reject the promise.
        error.status = BAD_GATEWAY;
        reject( error );
      } else {
        // Otherwise resolve promised with given information.
        resolve( info );
      }
    });
  });
}
