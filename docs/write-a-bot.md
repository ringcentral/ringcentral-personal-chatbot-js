# Write a personal bot

For a simple Hello bot:

```js
/**
 * exmaple bot file
 * reply to Hello with Hi
 */

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user, // user instance, check https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/src/server/models/ringcentral.js
  handled // if hanlded equals true, it means event already hanlded by prev skills
}) => {
  if (textFiltered === 'hello') {
    await user.sendMessage(group.id, {
      text: 'Hi'
    })
  }
}

exports.name = 'Hello bot'

exports.description = 'Bot only respond to "Hello"'

```

For more bot config, you can check [https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-bots/full-config-bot.js](https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-bots/full-config-bot.js)

## Real examples

- [ringcentral-personal-bot-template-js](https://github.com/rc-personal-bot-framework/ringcentral-personal-bot-template-js)