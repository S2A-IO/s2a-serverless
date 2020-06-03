'use strict';

/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file Entry point to load all lambda functions or serverless.
 */
module.exports = {
  'make-call': require( './make-call' ),
  'push-notification': require( './push-notification' ),
  'send-email': require( './send-email' ),
  'send-sms': require( './send-sms' )
};