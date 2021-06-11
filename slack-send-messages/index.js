'use strict';

/**
 * @author Copyright RIKSOF (Private) Limited.
 */

const { WebClient, ErrorCode } = require( '@slack/web-api' );

/**
 * @function setClient initialize webClient and set token to the web client
 * @param {string} token Token Slack User/Bot token
 * @returns {any} webClinet
 */
function setClient( token ) {
  // Initialize
  return new WebClient( token );
}

/**
 * @function postMessage function to post message on slack
 * 
 * @param {string} method method name of webClient
 * @param {any} payload  JSON object Cotaints channel/user id text and blocks/attacments
 * you can generate blocks from slack block kit  builder or template
 * visit for blocks: https://api.slack.com/block-kit or
 * https://app.slack.com/block-kit-builder
 */
function postMessage( token, method, payload ) {
  const web = setClient( token );
  try {
    // This method call should fail because we're giving it a bogus user ID to lookup.
    const result = web.apiCall( method, payload );
    return result;
  } catch ( error ) {
    // Check the code property, and when its a PlatformError, log the whole response.
    if ( error.code === ErrorCode.PlatformError ) {
      return error.data;
    } else {
      // Some other error, oh no!
      return error;
    }
  }
}

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
 module.exports.handler = function slack( data, context, callback ) {
  let p = [];
  if ( Array.isArray( data.current ) ) {
    for ( let i = 0; i < data.current.length; i++ ) {
      p[ i ] = postMessage( data.env.slackToken, 'chat.postMessage', data.current[ i ].payload );
    }
    p = Promise.all( p );
  } else {
    p = postMessage( data.env.slackToken, 'chat.postMessage', data.current.payload );
  }
  return p.then( function AfterpostMessage( response ) {
    callback( null, response );
  } ).catch( function OnPostMessageError( error ) {
    callback( error, null );
  } );
};