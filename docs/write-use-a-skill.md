# Write/use a bot skill

## Write a bot skill

For a simple ping-pong bot skill:

```js
/**
 * exmaple bot skill file
 * reply pong to ping
 */

export const onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user, // user instance, check https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/src/server/models/ringcentral.js
  handled // if hanlded equals true, it means event already hanlded by prev skills
}) => {
  if (textFiltered === 'ping') {
    await user.sendMessage(group.id, {
      text: `pong`
    })
    return true
  } else {
    return false
  }
}

exports.name = 'ping pong bot skill'
exports.description = 'ping pong bot skill, reply with pong when got command "ping"'

```

For full config, check [https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-skills/full-config-skill.js](https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-skills/full-config-skill.js)

## Use a bot skill

```js
// in you bot file
const skillA = require('skill-a')
const skillB = require('skill-b')
exports.skills = [skillA, skillB]
```

That is it.
