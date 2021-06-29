# Slack Integration

SendPostMessageHandler is a serverless function that is use for send messages to the slack channel or user by using following params Bot/App token, method name and payload.

## Details

##### Web APi

We are using slack [web-api](https://slack.dev/node-slack-sdk/web-api). This package contains a simple, convenient, and configurable HTTP client for making requests to Slack’s Web API. Use it in your app to call any of the over 130 methods, and let it handle formatting, queuing, retrying, pagination, and more.

```bash
npm install @slack/web-api
```

##### chat.postMessage

Sends a message to a channel.
see details: [chat.postMessage](https://api.slack.com/methods/chat.postMessage)

##### packages to add

Add "@slack/web-api": "6.2.4" on main package.json file

##### constants to add on build-args

Add slackToken on build-args.json // example: slackToken":"xoxb-2185005228672-2185029079728-KAQyumb4WqzYVfWuNb275H3c"
## Usage

```javascript

it.env.slackToken // user/bot token
it.current should have

 method: required // name of method ( example: 'chat.postMessage' )

 payload: required // payload object

 payload contain following keys:

 text: optional/required  // if blocks/attacment not given then text will be required ( Hello <@U0236LCK99Q> )

 channel: required  // channel id ( C022RT215L7 )

 attachment/blocks: optional

   /*
     attachments: [
          {
            text: "Choose a game to play",
            fallback: "You are unable to choose a game",
            callback_id: "wopr_game",
            color: "#3AA3E3",
            attachment_type: "default",
            actions: [
              {
                name: "game",
                text: "Chess",
                typeo: "button",
                "value": "chess"
              }
            ]
          }
        ]

      */

```

**final look will look like**

```javascript

/**
 *
 * Assign value to the current in your proc
 *
 */
it.current.method = 'chat.postMessage';

it.current.payload = {
  text: 'Hello <@U0236LCK99Q>,',
  channel: 'C022RT215L7',
  attachments: [
    {
      text: "Choose a game to play",
      fallback: "You are unable to choose a game",
      callback_id: "wopr_game",
      color: "#3AA3E3",
      attachment_type: "default",
      actions: [
        {
          name: "game",
          text: "Chess",
          typeo: "button",
          "value": "chess"
        },
        {
          "name": "game",
          "text": "Falken's Maze",
          "type": "button",
          "value": "maze"
        },
        {
          "name": "game",
          "text": "Thermonuclear War",
          "style": "danger",
          "type": "button",
          "value": "war",
          "confirm": {
            "title": "Are you sure?",
            "text": "Wouldn't you prefer a good game of chess?",
            "ok_text": "Yes",
            "dismiss_text": "No"
          }
        }
      ]
    }
  ]
};

/**
 * @function SendPostMessageHandler Calling lamda from flow
 * @param env.slackToken slack user/bot token (xox..-xxxxxxx... ) 
 * slackToken you will get from  inside your App side menue with the name of OAuth & Permissions
 *
 */

  {
    "task": "lambda",
    "key": "",
    "options": {
      "env": {
        "slackToken": "[[=it.slackToken]]",
      },
      "functionName": "{{= 'SendPostMessageHandler' }}"
    }
  }

```

## Helpful link

[Slack-APi](https://api.slack.com/)
[Slack-Node-APi-sdk](https://slack.dev/node-slack-sdk)
[web-api](https://slack.dev/node-slack-sdk/web-api)
[methods](https://api.slack.com/methods/)
[chat.postMessage](https://api.slack.com/methods/chat.postMessage)
[Block-kit](https://api.slack.com/block-kit)
[Block-kit-builder](https://app.slack.com/block-kit-builder)
[Apps](https://api.slack.com/apps/)
