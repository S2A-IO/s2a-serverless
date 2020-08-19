'use strict';

/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file Module for working with FCM Push Notification.
 */
const FCM = require( 'fcm-push' );

/**
 * PushNotification class for working with firebase cloud message to send push notification
 *
 * @class [PushNotification Object]
 *
 */
class PushNotification {

  /**
   * Constructor
   *
   * @constructor
   *
   * @param {string} credentials             credentials for FCM.
   *
   * @class [PushNotification Object]
   */
  constructor( credentials ) {
    this.fcm = new FCM( credentials );
  }

  /**
   * Sends a push message to the device.
   *
   * @param {string} deviceId                   Device id for the message.
   * @param {string} message                    Message to be send.
   *
   * @returns {Promise} p
   */
  send( deviceId, message ) {
    return this.fcm.send( deviceId, message ).catch( function OnPushNotification( err ) {
      return Promise.resolve( err );
    });
  }
}

// Make the module available to all
module.exports = PushNotification;
